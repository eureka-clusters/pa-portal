import React, { useContext, createContext, useState, useEffect } from "react";
import GetAccessToken from '../function/GetAccessToken';
import GetAccessTokenFromRefreshToken from '../function/GetAccessTokenFromRefreshToken';
import {
    useLocation,
    useHistory
} from "react-router-dom";
import { useReducer } from 'react'
import moment from 'moment';
import Moment from 'react-moment';



export const KEY_EXPIRES_IN = 'authExpire'
export const KEY_ACCESS_TOKEN = 'accessToken';
export const KEY_REFRESH_TOKEN = 'refreshToken';
export const KEY_USER_STATE = 'user';
export const KEY_REDIRECT = 'redirect';


const authContext = createContext();


const OAuth = {
    isAuthenticated: false,
    signin(cb) {
        OAuth.isAuthenticated = true;
        setTimeout(cb, 2000); // fake async
    },
    signout(cb) {
        OAuth.isAuthenticated = false;
        setTimeout(cb, 100);
    },
    authorize(authorizationCode, cb) {
        console.log('authorizationCode in custom oauth', authorizationCode);
        return GetAccessToken(authorizationCode);
    },
    refresh(refreshToken, cb) {
        console.log('Use the refresh token', refreshToken);
        return GetAccessTokenFromRefreshToken(refreshToken);
    },
};

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {

    return useContext(authContext);

    // let context = useContext(authContext);
    // let isAuthValid = context.checkAuthExpire();
    // useEffect(() => {
    //     console.log("Token is valid: ", isAuthValid);
    //     if (!isAuthValid && typeof context.refreshToken !== 'undefined' && context.refreshToken !== null) {
    //         console.log("Refresh token 2: ", typeof context.refreshToken);
    //         context.LoginWithRefreshToken(context.refreshToken, () => {
    //         });
    //     }
    // }, [isAuthValid, context]);

    // return context;
};


function localStorageParse(type) {
    if (!isNaN(type)) {
        return typeof type == 'string' ? JSON.parse(type) : type;
    } else {
        return type;
    }
}


// Provider hook that creates auth object and handles state
function useProvideAuth() {
    const [redirect, setRedirect] = useState(localStorage.getItem('redirect'));
    //let storage = window.sessionStorage;
    let storage = localStorage;

    const [state, setState] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            user: localStorage.getItem('user'),
            refreshToken: localStorage.getItem('refreshToken'),
            accessToken: localStorage.getItem('accessToken'),
            authExpire: localStorageParse(localStorage.getItem('authExpire')),
            redirect: localStorage.getItem('redirect'),
            loading: false
        }
    );

    // for direct access
    const accessToken = state.accessToken;
    const refreshToken = state.refreshToken;
    const authExpire = state.authExpire;
    const user = state.user;

    const isExpired = (exp) => {
        if (exp === undefined) {
            return false;
        }
        // console.log('moment', moment().unix());
        // console.log('moment2', moment.unix(Number(exp)).unix());
        return moment().unix() > moment.unix(Number(exp)).unix();
    };

    const getRefreshToken = () => {
        return storage.getItem(KEY_REFRESH_TOKEN);
    }

    const getExpirationDate = () => {
        return storage.getItem(KEY_EXPIRES_IN);
    }

    const getAccessToken = () => {
        return storage.getItem(KEY_ACCESS_TOKEN);
    }

    // with async
    async function UseRefreshToken(cb) {
        const refreshToken = getRefreshToken();
        console.log('UseRefreshToken called');
        await OAuth
            .refresh(refreshToken)    // or call GetAccessToken(authorizationCode) directly
            .then((bearerToken) => {
                console.log('UseRefreshToken new bearerToken', bearerToken);
                setBearerToken(bearerToken);
            }).then(() => {
                typeof cb == "function" && cb();
            });

        //const accessToken = storage.getItem(KEY_ACCESS_TOKEN);
        return getAccessToken();
    }

    function getToken() {
        if (isExpired(getExpirationDate())) {
            console.log('isExpired');
            const updatedToken = UseRefreshToken();
            console.log('updatedToken', updatedToken);
            return getAccessToken();
        }
        return getAccessToken();
    };
    

    // without async
    // function UseRefreshToken(cb) {
    //     const refreshToken = getRefreshToken();
    //     console.log('UseRefreshToken called');
    //     OAuth
    //         .refresh(refreshToken)    // or call GetAccessToken(authorizationCode) directly
    //         .then((bearerToken) => {
    //             console.log('UseRefreshToken new bearerToken', bearerToken);
    //             setBearerToken(bearerToken);
    //         }).then(() => {
    //             typeof cb == "function" && cb();
    //         });

    //     //const accessToken = storage.getItem(KEY_ACCESS_TOKEN);
    //     return getAccessToken();
    // }

    // function getToken() {
    //     if (isExpired(getExpirationDate())) {
    //         console.log('isExpired');
    //         const updatedToken = UseRefreshToken();
    //         console.log('updatedToken', updatedToken);
    //         return getAccessToken();
    //     }
    //     return getAccessToken();
    // };

    const signin = cb => {
        return OAuth.signin(() => {
            setState({
                user: 'user',
            });
            cb();
        });
    };

    const signout = cb => {
        return OAuth.signout(() => {
            setState({
                user: null,
            });
            cb();
        });
    };

    const RedirectAfterLogin = () => {
        console.log('RedirectAfterLogin', redirect);
        let history = useHistory();
        history.replace(redirect);
    }

    const SaveRedirect = () => {
        let location = useLocation();
        let { from } = location.state || { from: { pathname: "/" } };

        if (from.pathname && from.pathname !== '/login' && from.pathname !== '/callback') {
            localStorage.setItem('redirect', from.pathname);
            //redirect = from.pathname;
            //setRedirect(from.pathname);
        }
    }

    const setBearerToken = (bearerToken) => {
        // console.log('bearerToken', bearerToken);
        if (bearerToken.status != 400) {
            console.info('set tokens to storage', bearerToken);
            localStorage.setItem('refreshToken', bearerToken.refresh_token);
            localStorage.setItem('accessToken', bearerToken.access_token);
            localStorage.setItem('user', true);
            //let newAuthExpire = new Date().getTime() + bearerToken.expires_in * 1000;

            let newAuthExpire = moment().add(bearerToken.expires_in, 's').unix();

            //newAuthExpire = new Date().getTime() + 1000 * 1000;

            // console.log('newAuthExpire', newAuthExpire, new Date(newAuthExpire));
            localStorage.setItem('authExpire', newAuthExpire);

            setState({
                accessToken: bearerToken.access_token,
                refreshToken: bearerToken.refresh_token,
                authExpire: newAuthExpire,
                user: 'user',
            });
        } else {
            // error handling 
            //title: "invalid_grant", status: 400, detail: "Invalid refresh token"
            // console.log(bearerToken.status, bearerToken.detail, bearerToken.title);
        }


        //@Benjamin, don't think we need it here, we get it from the service
        //checkAuthExpire();
    };

    /*
    set expire time to a past value for testing to thest the oauth refresh
    */
    const invalidateToken = () => {
        localStorage.setItem('authExpire', moment().unix());
    };

    const checkAuthExpire = () => {
        var current = new Date();
        var compare = new Date(state.authExpire);

        // console.log('compare', compare);
        // console.log('current', current);
        // console.log('compare.getTime()', compare.getTime());
        // console.log('current.getTime()', current.getTime());
        return (compare.getTime() >= current.getTime()) ? true : false;
    };

    const LoginWithAuthorizationCode = (authorizationCode, cb) => {
        return OAuth
            .authorize(authorizationCode)    // or call GetAccessToken(authorizationCode) directly
            .then((bearerToken) => {
                setBearerToken(bearerToken);
            }).then(() => {
                typeof cb == "function" && cb();
            });
    };

    const LoginWithRefreshToken = (refreshToken, cb) => {
        return OAuth
            .refresh(refreshToken)    // or call GetAccessToken(authorizationCode) directly
            .then((bearerToken) => {
                setBearerToken(bearerToken);
            }).then(() => {
                typeof cb == "function" && cb();
            });
    };

    const logout = (cb) => {
        // setUser(null);
        // setAccessToken(null);
        // setRefreshToken(null);

        setState({
            accessToken: null,
            refreshToken: null,
            user: null,
        });


        // remove the items localStorage.setItem('user', null); would be (string) "null"
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('authExpire');
        localStorage.removeItem('redirect');

        // localStorage.setItem('refreshToken', null);
        // localStorage.setItem('accessToken', null);
        // localStorage.setItem('user', null);
        // localStorage.setItem('authExpire', null);
        // localStorage.setItem('redirect', null);




        typeof cb == "function" && cb();
    };

    // Return the user object and auth methods

    return {
        state,
        user,
        signin,
        signout,
        redirect,
        RedirectAfterLogin,
        SaveRedirect,
        LoginWithAuthorizationCode,
        LoginWithRefreshToken,
        checkAuthExpire,
        authExpire,
        accessToken,
        refreshToken,
        invalidateToken,
        getToken,
        //getAccessToken,
        getRefreshToken,
        UseRefreshToken,
        logout
    };
}