import React, { useContext, createContext, useState, useEffect } from "react";
import GetAccessToken from '../function/GetAccessToken';
import GetAccessTokenFromRefreshToken from '../function/GetAccessTokenFromRefreshToken';
import {
    useLocation,
    useHistory
} from "react-router-dom";
import { useReducer } from 'react'

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

    let context = useContext(authContext);

    let isAuthValid = context.checkAuthExpire();

   

    useEffect(() => {       
        console.log("Token is valid: ", isAuthValid);
        if (!isAuthValid && typeof context.refreshToken !== 'undefined' && context.refreshToken !== null) {
            console.log("Refresh token 2: ", typeof context.refreshToken);
            context.LoginWithRefreshToken(context.refreshToken, () => {
            });
        }
    }, [isAuthValid, context]);

    return context;
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
    // const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    // const [authExpire, setAuthExpire] = useState(localStorageParse(localStorage.getItem('authExpire')));
    //const [user, setUser] = useState(localStorageParse(localStorage.getItem('user')));
    // const [user, setUser] = useState(localStorage.getItem('user'));
    // const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
    const [redirect, setRedirect] = useState(localStorage.getItem('redirect'));

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



    // localStorage is needed it doesn't work without
    //const [redirect, setRedirect] = useState(null);


    // @johan does localStorage doesn't work in different tabs?
    // i can login in one tab and another tab is still not logged in
    console.log('user in useProvideAuth by useState', user, typeof user);
    console.log('localStorage.getItem(\'user\')', localStorage.getItem('user'));

    const signin = cb => {
        return OAuth.signin(() => {
            // setUser("user");
            setState({
                user: 'user',
            });

            cb();
        });
    };

    const signout = cb => {
        return OAuth.signout(() => {
            // setUser(null);
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
        console.log('bearerToken', bearerToken);
        localStorage.setItem('refreshToken', bearerToken.refresh_token);
        localStorage.setItem('accessToken', bearerToken.access_token);
        localStorage.setItem('user', true);
        let newAuthExpire = new Date().getTime() + bearerToken.expires_in * 1000;
        //  console.log('newAuthExpire', newAuthExpire, new Date(newAuthExpire));
        localStorage.setItem('authExpire', newAuthExpire);

        setState({
            accessToken: bearerToken.access_token,
            refreshToken: bearerToken.refresh_token,
            authExpire: newAuthExpire,
            user: 'user',
        });

        //@Benjamin, don't think we need it here, we get it from the service
        //checkAuthExpire();
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
        logout
    };
}