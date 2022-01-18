import { createContext, FC, useContext, useReducer } from 'react';
import { useHistory } from "react-router-dom";
import { GetServerUri } from 'function/api';
import { iUserinfo } from 'interface/auth/userinfo';


const AuthContext = createContext<any>({}); //Any, might be replaced by more strict objects

export const KEY_USER = 'user';
export const KEY_USER_INFO = 'userInfo';
export const KEY_REDIRECT = 'redirect';
export const KEY_TOKEN = 'token';

type CallbackHandler = () => void

// interface UserContent {
//     jwtToken: string,
//     user?: string,
// }
interface iLocation {
    pathname: string
}
interface iProps {
    children: JSX.Element
}

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export const ProvideAuth: FC<iProps> = ({ children }) => {
    const auth = useProvideAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
    return useContext(AuthContext);
};


function useProvideAuth() {

    let storage = localStorage;
    let history = useHistory();

    const setUser = (username: string) => {
        storage.setItem(KEY_USER, username)
    }

    const getUser = () => {
        return storage.getItem(KEY_USER)
    }

    const setJwtToken = (token: string) => {
        storage.setItem(KEY_TOKEN, token)
    }

    const getJwtToken = () => {
        return storage.getItem(KEY_TOKEN)
    }

    const setUserInfo = (userinfo: iUserinfo) => {
        // console.log(['setUserInfo ', userinfo]);
        // userinfo must be saved a json string into storage as no objects could be saved
        storage.setItem(KEY_USER_INFO, JSON.stringify(userinfo));
    }

    const getUserInfo = () => {
        let userinfo = storage.getItem(KEY_USER_INFO);
        if (userinfo) {
            return JSON.parse(userinfo);
        }
        return null;
    }

    const setRedirect = (location: iLocation) => {
        // console.log(['saveRedirect with from ', location]);
        storage.setItem(KEY_REDIRECT, location.pathname);
    }

    const getRedirect = () => {
        return storage.getItem(KEY_REDIRECT);
    }

    const [state, setState] = useReducer(
        (state: any, newState: any) => ({ ...state, ...newState }),
        {
            // user: storage.getItem(KEY_USER),

            // userInfo: storage.getItem(KEY_USER_INFO) ? JSON.parse(storage.getItem(KEY_USER_INFO)) : null,
            // userInfo: storage.getItem(KEY_USER_INFO) ? JSON.parse(storage.getItem(KEY_USER_INFO)) : '',
            // userInfo: storage.getItem(KEY_USER_INFO) ? JSON.parse(storage.getItem(KEY_USER_INFO)) : {},
            // token: storage.getItem(KEY_TOKEN),
            // redirect: storage.getItem(KEY_REDIRECT),

            user: getUser(),
            userInfo: getUserInfo(),
            token: getJwtToken(),
            redirect: getRedirect(),
            loading: false,
            errorMessage: null
        }
    );

    // return values for the states
    const user = state.user;
    const userInfo = state.userInfo;
    const redirect = state.redirect;
    const token = state.token;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function __delay__(timer: number | undefined) {
        return new Promise<void>(resolve => {
            timer = timer || 2000;
            setTimeout(function () {
                resolve();
            }, timer);
        });
    };

    const logout = () => {
        setState({
            token: null,
            user: null,
            userInfo: null,
        });
        storage.removeItem(KEY_TOKEN)
        storage.removeItem(KEY_USER)
        storage.removeItem(KEY_USER_INFO)
    }

  

    const hasUser = () => {
        // must use the states instead.
        return null !== user;
        // return null !== storage.getItem('user');
    }

   
    // const requestUserInfo = async (jwtToken: string): iUserinfo =>  {
    // todo iUserinfo returns no promise which async needs.
    const requestUserInfo = async (jwtToken: string) => {
        var serverUri = GetServerUri();
        console.log(['serverUri', serverUri]);
        let response = await fetch(serverUri + '/api/me',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                    // 'Authorization': 'Bearer ' + accessToken
                }
            }
        ).then((res) => res.json()).then((res) => {
            console.log(['requestUserInfo res 1', res]);
            return res
            // missing is error handling which i had the last time => still todo
        });

        // test delay check if the function and cb are waiting correctly
        // await __delay__(2000);

        console.log(['requestUserInfo res', response]);
        return response;
    }

    const loginWithToken = async (token: string, cb: CallbackHandler) => {

        // todo: missing error handling for requestUserInfo
        // use token to get the userInfo (if this succeeds the token is valid)
        let userinfo = await requestUserInfo(token);
        let user = userinfo.email;
        console.log(['userinfo in loginWithToken', userinfo]);

        // save items in storage       
        setUser(user);
        setJwtToken(token);
        setUserInfo(userinfo);

        // set the states (can't be done in the storage functions as each change would create a re-render)        
        setState({
            token: token,
            user: user,
            userInfo: userinfo,
        });
        typeof cb == "function" && cb();
    }

    const saveRedirect = (location: iLocation) => {
        if (location) {
            setRedirect(location);
        }
    }

    const redirectAfterLogin = () => {
        console.log(['redirectAfterLogin to ', redirect]);
        history.replace(redirect);
    }

    return {
        // states
        user,
        userInfo,
        redirect,
        token,

        // pretty sure we don't want that some code set the user and token externally?
        // setUser, 
        // setJwtToken,

        // storage functions
        hasUser,
        getJwtToken,
        getUser,
        getUserInfo,

        // other functions
        logout,
        loginWithToken,
        redirectAfterLogin,
        saveRedirect,
    }
}