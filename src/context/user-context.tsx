import {createContext, FC, useContext, useReducer} from 'react';
import {useNavigate} from "react-router-dom";
import {UserInfo} from 'interface/auth/user-info';
import jwtDecode, {JwtPayload} from "jwt-decode";
import {configureAxiosHeaders} from "../function/configure-axios-headers";
import {useMe} from "../hooks/api/user/use-me";


const AuthContext = createContext<any>({}); //Any, might be replaced by more strict objects

export const KEY_USER = 'user';
export const KEY_USER_INFO = 'UserInfo';
export const KEY_REDIRECT = 'redirect';
export const KEY_TOKEN = 'token';

type CallbackHandler = () => void

interface iLocation {
    pathname: string
}

interface iProps {
    children: JSX.Element
}

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export const ProvideAuth: FC<iProps> = ({children}) => {
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

    let navigate = useNavigate();

    const setUser = (username: string) => {
        storage.setItem(KEY_USER, username)
    }

    const getUser = () => {
        return storage.getItem(KEY_USER)
    }

    const setJwtToken = (token: string) => {
        storage.setItem(KEY_TOKEN, token)
    }

    const getJwtTokenStorage = () => {
        return storage.getItem(KEY_TOKEN)
    }

    const setUserInfo = (UserInfo: UserInfo) => {
        // UserInfo must be saved a json string into storage as no objects could be saved
        storage.setItem(KEY_USER_INFO, JSON.stringify(UserInfo));
    }

    const getUserInfo = () => {
        let UserInfo = storage.getItem(KEY_USER_INFO);
        if (UserInfo) {
            return JSON.parse(UserInfo);
        }
        return null;
    }

    const setRedirect = (location: iLocation) => {
        storage.setItem(KEY_REDIRECT, location.pathname);
    }

    const getRedirect = () => {
        return storage.getItem(KEY_REDIRECT);
    }

    const [state, setState] = useReducer(
        (state: any, newState: any) => ({...state, ...newState}),
        {
            user: getUser(),
            UserInfo: getUserInfo(),
            token: getJwtTokenStorage(),
            redirect: getRedirect(),
            loading: false,
            errorMessage: null
        }
    );

    // return values for the states
    const user = state.user;
    const UserInfo = state.UserInfo;
    const redirect = state.redirect;
    const token = state.token;
    const error = state.errorMessage;

    const logout = () => {
        setState({
            token: null,
            user: null,
            UserInfo: null,
        });
        storage.removeItem(KEY_TOKEN)
        storage.removeItem(KEY_USER)
        storage.removeItem(KEY_USER_INFO)
    }


    const checkToken = (token: string | null) => {
        if (token) {
            const decoded = jwtDecode<JwtPayload>(token);
            const now = Date.now().valueOf() / 1000

            if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
                throw new Error(`token expired: ${JSON.stringify(decoded)}`)
            }
            if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
                throw new Error(`token expired: ${JSON.stringify(decoded)}`)
            }
            return true;
        }
        return false;
    }

    const getJwtToken = () => {
        const token = getJwtTokenStorage();
        if (token === null)
            return undefined;

        try {
            checkToken(token);

            configureAxiosHeaders(token);


            return token;
        } catch (error) {
            console.debug('catch error in getJwtToken logout user', error);
            logout();
            // throw (error);
            return undefined;
        }
    }


    const hasUser = () => {
        return null !== user;
    }


    const requestUserInfo = async (): UserInfo => {
        //const {load, user} = useMe();

        try {

            return user;
        } catch (error) {
            console.error(['requestUserInfo error', error]);
            throw (error);
        }
    }

    const loginWithToken = async (token: string) => {

        // use token to get the UserInfo (if this succeeds the token is valid)
        configureAxiosHeaders(token);

        try {
            let UserInfo = await requestUserInfo();
            let user = UserInfo.email;

            // save items in storage       
            setUser(user);
            setJwtToken(token);
            setUserInfo(UserInfo);

            // set the states (can't be done in the storage functions as each change would create a re-render)        
            setState({
                token: token,
                user: user,
                UserInfo: UserInfo,
            });



            return true;
        } catch (error: any) {
            // } catch (error: Error) {
            console.error(error);
            setState({
                errorMessage: 'UserInfo could not been loaded ' + error.message
            });
        }
    }

    const saveRedirect = (location: iLocation) => {
        if (location) {
            setRedirect(location);
        }
    }

    const redirectAfterLogin = () => {
        navigate(redirect);
    }

    return {
        // states
        error,
        user,
        UserInfo,
        redirect,
        token,

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