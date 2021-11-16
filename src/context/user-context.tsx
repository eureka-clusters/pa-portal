import React, {useContext, createContext, FC} from "react";
import useState from 'react-usestateref';
import {useLocation} from "react-router-dom";
import moment from 'moment';

import {OAuth2} from 'function/o-auth2';
import {BearerToken} from "function/o-auth2";

export const KEY_EXPIRES_IN = 'authExpire'
export const KEY_ACCESS_TOKEN = 'accessToken';
export const KEY_REFRESH_TOKEN = 'refreshToken';
export const KEY_USER_STATE = 'user';
export const KEY_USER_INFO = 'userInfo';
export const KEY_REDIRECT = 'redirect';

interface Props {
    children: JSX.Element
}

interface UserContent {
    accessToken?: string,
    refreshToken?: string,
    authExpire?: number,
    redirect?: string,
    user?: string,
    userInfo?: any
}

const AuthContext = createContext<any>({});

const auth = UseProvideAuth();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export const ProvideAuth: FC<Props> = ({children}) => (
    <AuthContext.Provider value={ UseProvideAuth() }>
        {children}
    </AuthContext.Provider>
)

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const UseAuth = () => {
    return useContext(AuthContext);
};

// Provider hook that creates auth object and handles state
function UseProvideAuth() {
    // we could use different storage  (session / localStorage)
    //let storage = window.sessionStorage;
    let storage = localStorage;

    // const [redirect, setRedirect] = useState(storage.getItem(KEY_REDIRECT));

    // const [state, setState] = useState(
    //     (state: any, newState: any) => ({...state, ...newState}),
    //     {
    //         //user: storage.getItem('user') ? JSON.parse(storage.getItem('user')) : null,
    //         user: storage.getItem(KEY_USER_STATE),
    //         userInfo: storage.getItem(KEY_USER_INFO) ? JSON.parse(storage.getItem(KEY_USER_INFO)) : null,
    //         refreshToken: storage.getItem(KEY_REFRESH_TOKEN),
    //         accessToken: storage.getItem(KEY_ACCESS_TOKEN),
    //         authExpire: storage.getItem(KEY_EXPIRES_IN),
    //         redirect: storage.getItem(KEY_REDIRECT),  // has to be an independent useState
    //         loading: false,
    //         errorMessage: null
    //     }
    // );

    //Init the state (with an empty object?)
    //const [state, setState] = useState<UserContent>({} as UserContent);

    //Use the same mechanism as for the set HookState to have simpler type hinting
    //const setUserContent = (userContent: UserContent) => {
    //    setState(state => ({...state, ...userContent}))
    //}

    // state for current running refresh via refreshToken
    // eslint-disable-next-line no-unused-vars
    //const [isRefreshing, setIsRefreshing, isRefreshing_ref] = useState(false);

    // for direct access
    // const accessToken = state.accessToken;
    // const refreshToken = state.refreshToken;
    // const authExpire = state.authExpire;
    // const user = state.user;
    // const userInfo = state.userInfo;
    // const redirect = state.redirect;

    // const accessToken = '';
    // const refreshToken = state.refreshToken;
    // const authExpire = state.authExpire;
    // const user = state.user;
    // const userInfo = state.userInfo;
    // const redirect = state.redirect;

    function __delay__(timer: number) {
        return new Promise<void>(resolve => {
            timer = timer || 2000;
            setTimeout(function () {
                resolve();
            }, timer);
        });
    }

    const isExpired = (exp ?: number) => {
        if (exp === undefined) {
            return false;
        }
        return moment().unix() > moment.unix(Number(exp)).unix();
    };

    const getRefreshToken = () => {
        return storage.getItem(KEY_REFRESH_TOKEN);
    }

    const getExpirationDate = () => {
        return Number(storage.getItem(KEY_EXPIRES_IN));
    }

    const getAccessToken = () => {
        return storage.getItem(KEY_ACCESS_TOKEN);
    }

    const UseRefreshToken = async (cb ?: any) => {
        let refreshToken = getRefreshToken();

        //Short circuit the function when we have no refresh token (can be null)
        if (null === refreshToken) {
            return null
        }

        await OAuth2
            .RefreshRequest(refreshToken)    // or call GetAccessToken(authorizationCode) directly
            .then((bearerToken) => {
                if (typeof bearerToken !== 'undefined') {
                    // console.debug('UseRefreshToken new bearerToken', bearerToken);
                    setBearerToken(bearerToken);
                }
            }).then(() => {
                typeof cb == "function" && cb();
            }).catch(() => {
                // console.debug('catch error in UseRefreshToken logout user', error);
                logout();
            });
        return getAccessToken();
    }

    const getToken = async () => {
        // console.log(['isRefreshing_ref', isRefreshing_ref.current]);
       // if (isRefreshing_ref.current) {
       //     // console.log('is currently refreshing token wait!');
       //     await waitForRefreshFinish();
       // }

        if (isExpired(getExpirationDate())) {
            // console.debug('getToken isExpired:');
            //setIsRefreshing(true);
            // console.log(['isRefreshing_ref after setting true', isRefreshing_ref.current]);
            await UseRefreshToken();

            // test delay by 3 seconds if the second request to getTokenTest2 really waits.
            // await __delay__(3000);
        }
        //setIsRefreshing(false);
        // console.log(['isRefreshing_ref after setting false', isRefreshing_ref.current]);
        return getAccessToken();
    };

    const waitForRefreshFinish = async () => {
        return false;
        // if (isRefreshing_ref.current) {
        //     // console.log('waitForRefreshFinish: isRefreshing_ref.current = true wait for another 100 ms ', isRefreshing_ref.current);
        //     // delay for 100ms before rechecking
        //     await __delay__(100);
        //     await waitForRefreshFinish();
        // } else {
        //     // console.log('waitForRefreshFinish: isRefreshing_ref.current = false ', isRefreshing_ref.current);
        //     return true;
        // }
    }

    const RedirectAfterLogin = () => {
        // let history = useHistory();
        // history.replace(redirect);
    }

    const SaveRedirect = () => {
        let location = useLocation();
        let {from} = location.state || {from: {pathname: "/"}};

        if (from.pathname && from.pathname !== '/login' && from.pathname !== '/callback') {
            storage.setItem(KEY_REDIRECT, from.pathname);
        }
    }

    const setBearerToken = (bearerToken: BearerToken) => {
        // console.debug('setBearerToken bearerToken', bearerToken);
        if (bearerToken.status !== 400) {
            let newAuthExpire = moment().add(Number(bearerToken.expires_in), 's');
            // console.debug('newAuthExpire in setBearerToken', newAuthExpire.format('LLL'));

            storage.setItem(KEY_REFRESH_TOKEN, bearerToken.refresh_token);
            storage.setItem(KEY_ACCESS_TOKEN, bearerToken.access_token);
            storage.setItem(KEY_USER_STATE, String(true));
            storage.setItem(KEY_EXPIRES_IN, String(newAuthExpire.unix()));

            // setUserContent({
            //     accessToken: bearerToken.access_token,
            //     refreshToken: bearerToken.refresh_token,
            //     authExpire: newAuthExpire.unix(),
            //     user: "true",
            // });
        } else {
            // error handling (errors should be caught)
            //title: "invalid_grant", status: 400, detail: "Invalid refresh token"
            console.error(bearerToken.status, bearerToken.detail, bearerToken.title);
            throw new Error("Bad Bearer Token from server");
        }
    };

    /*
    set expire time to a past value for testing to test the oauth refresh
    */
    const invalidateToken = () => {
        storage.setItem(KEY_EXPIRES_IN, String(moment().unix()));
    };

    const LoginWithAuthorizationCode = async (authorizationCode: string, cb ?: any) => {
        await OAuth2
            .AuthorizeRequest(authorizationCode)
            .then((bearerToken: BearerToken) => {
                // console.debug('LoginWithAuthorizationCode new bearerToken', bearerToken);
                setBearerToken(bearerToken);
            }).then(() => {
                typeof cb == "function" && cb();
            }).catch((err) => {
                console.debug('catch error in LoginWithAuthorizationCode', err);
                //setState({errorMessage: err.message});
                return false;
            });
        return getAccessToken();
    }

    // const GetUserInfo = async () => {
    //     let serverUri = GetServerUri();
    //     let accessToken = await getToken();
    //     fetch(serverUri + '/api/me',
    //         {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + accessToken
    //             }
    //         }
    //     ).then((res) => res.json()).then((res) => {
    //         storage.setItem(KEY_USER_INFO, JSON.stringify(res));
    //         setUserContent({
    //             userInfo: res,
    //         });
    //     });
    // }

    const logout = (cb ?: any) => {
        // setUserContent({
        //     accessToken: undefined,
        //     refreshToken: undefined,
        //     user: undefined,
        //     userInfo: undefined,
        // });

        storage.removeItem(KEY_REFRESH_TOKEN);
        storage.removeItem(KEY_ACCESS_TOKEN);
        storage.removeItem(KEY_USER_STATE);
        storage.removeItem(KEY_USER_INFO);
        storage.removeItem(KEY_EXPIRES_IN);
        storage.removeItem(KEY_REDIRECT);
        typeof cb == "function" && cb();
    }

    // Return the user object and auth methods

    return {
 //       state,
 //       user,
 //       userInfo,
 //       redirect,
        RedirectAfterLogin,
        SaveRedirect,
        LoginWithAuthorizationCode,
 //       authExpire,
 //       accessToken,
 //       refreshToken,
        invalidateToken,
        getToken,
        getAccessToken,
        getRefreshToken,
        UseRefreshToken,
        logout
    };
}