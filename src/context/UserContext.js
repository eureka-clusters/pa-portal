import React, { useContext, createContext } from "react";
import useState from 'react-usestateref';
import {
    useLocation,
    useHistory
} from "react-router-dom";
import { useReducer } from 'react'
import moment from 'moment';
// import Moment from 'react-moment';
// import { authStates, OAuth2 } from '../function/OAuth2';
import { OAuth2 } from '../function/OAuth2';

export const KEY_EXPIRES_IN = 'authExpire'
export const KEY_ACCESS_TOKEN = 'accessToken';
export const KEY_REFRESH_TOKEN = 'refreshToken';
export const KEY_USER_STATE = 'user';
export const KEY_REDIRECT = 'redirect';



const authContext = createContext();

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
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {

    const [redirect, setRedirect] = useState(localStorage.getItem('redirect'));

    // we could use different storage  (session / localStorage)
    //let storage = window.sessionStorage;
    let storage = localStorage;

    const [state, setState] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            user: storage.getItem('user'),
            refreshToken: storage.getItem(KEY_REFRESH_TOKEN),
            accessToken: storage.getItem(KEY_ACCESS_TOKEN),
            authExpire: storage.getItem(KEY_EXPIRES_IN),
            redirect: storage.getItem(KEY_REDIRECT),
            loading: false,
            errorMessage: null
        }
    );

    // state for current running refresh via refreshToken
    const [isRefreshing, setIsRefreshing, isRefreshing_ref] = useState(false);

    // for direct access
    const accessToken = state.accessToken;
    const refreshToken = state.refreshToken;
    const authExpire = state.authExpire;
    const user = state.user;


    function __delay__(timer) {
        return new Promise(resolve => {
            timer = timer || 2000;
            setTimeout(function () {
                resolve();
            }, timer);
        });
    };


    const test = async (cb) => {
        let refreshToken = getRefreshToken();
        await OAuth2
            .RefreshRequest(refreshToken)    // or call GetAccessToken(authorizationCode) directly
            .then((bearerToken) => {
                console.log('UseRefreshToken new bearerToken', bearerToken);
                setBearerToken(bearerToken);
            }).then(() => {
                typeof cb == "function" && cb();
            }).catch((error) => {
                //  on errors of the refesh request we have to logout the user as no new accesstoken+refreshtoken could be generated.
                console.log('catch error in UseRefreshToken logout user', error);
                logout();
            });
        return getAccessToken();
    }

    const isExpired = (exp) => {
        if (exp === undefined) {
            return false;
        }
        // console.debug('moment', moment().unix());
        // console.debug('moment2', moment.unix(Number(exp)).unix());
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

    const UseRefreshToken = async (cb) => {
        let refreshToken = getRefreshToken();
        await OAuth2
            .RefreshRequest(refreshToken)    // or call GetAccessToken(authorizationCode) directly
            .then((bearerToken) => {
                console.debug('UseRefreshToken new bearerToken', bearerToken);
                setBearerToken(bearerToken);
            }).then(() => {
                typeof cb == "function" && cb();
            }).catch((error) => {
                console.debug('catch error in UseRefreshToken logout user', error);
                logout();
            });
        return getAccessToken();
    }

    const getToken = async () => {

        return 'efcf33fae957d43c48e60e511bf593968457a76b';

        console.log(['isRefreshing_ref', isRefreshing_ref.current]);
        if (isRefreshing_ref.current) {
            console.log('is currently refreshing token wait!');
            await waitForRefreshFinish();
        }

        if (isExpired(getExpirationDate())) {
            console.debug('getToken isExpired:');
            setIsRefreshing(true);
            console.log(['isRefreshing_ref after setting true', isRefreshing_ref.current]);

            const updatedToken = await UseRefreshToken();
            console.debug('getToken updatedToken:', updatedToken);

            // test delay by 3 seconds if the second request to getTokenTest2 really waits.
            // await __delay__(3000);
        }
        setIsRefreshing(false);
        console.log(['isRefreshing_ref after setting false', isRefreshing_ref.current]);

        return getAccessToken();
    };

    const waitForRefreshFinish = async () => {
        if (isRefreshing_ref.current === true) {
            console.log('waitForRefreshFinish: isRefreshing_ref.current = true wait for another 100 ms ', isRefreshing_ref.current);
            // delay for 100ms before rechecking
            await __delay__(100);
            await waitForRefreshFinish();
        } else {
            console.log('waitForRefreshFinish: isRefreshing_ref.current = false ', isRefreshing_ref.current);
            return true;
        }
    }


    const RedirectAfterLogin = () => {
        console.log('RedirectAfterLogin', redirect);
        let history = useHistory();
        history.replace(redirect);
    }

    const SaveRedirect = () => {
        let location = useLocation();
        let { from } = location.state || { from: { pathname: "/" } };

        if (from.pathname && from.pathname !== '/login' && from.pathname !== '/callback') {
            storage.setItem(KEY_REDIRECT, from.pathname);
            //redirect = from.pathname;
            //setRedirect(from.pathname);
        }
    }

    const setBearerToken = (bearerToken) => {
        console.debug('setBearerToken bearerToken', bearerToken);
        if (bearerToken.status !== 400) {
            let newAuthExpire = moment().add(Number(bearerToken.expires_in), 's');
            console.debug('newAuthExpire in setBearerToken', newAuthExpire.format('LLL'));

            storage.setItem(KEY_REFRESH_TOKEN, bearerToken.refresh_token);
            storage.setItem(KEY_ACCESS_TOKEN, bearerToken.access_token);
            storage.setItem(KEY_USER_STATE, true);
            storage.setItem(KEY_EXPIRES_IN, newAuthExpire.unix());

            setState({
                accessToken: bearerToken.access_token,
                refreshToken: bearerToken.refresh_token,
                authExpire: newAuthExpire.unix(),
                user: true,
            });
        } else {
            // error handling (errors should be catched)
            //title: "invalid_grant", status: 400, detail: "Invalid refresh token"
            console.error(bearerToken.status, bearerToken.detail, bearerToken.title);
            throw new Error("Bad Bearer Token from server");
        }
    };

    /*
    set expire time to a past value for testing to test the oauth refresh
    */
    const invalidateToken = () => {
        storage.setItem(KEY_EXPIRES_IN, moment().unix());
    };
    
    const LoginWithAuthorizationCode = async (authorizationCode, cb) => {
        await OAuth2
            // .AuthorizeRequest(authorizationCode + 'test') // just a test to create some error
            .AuthorizeRequest(authorizationCode)
            .then((bearerToken) => {
                console.debug('LoginWithAuthorizationCode new bearerToken', bearerToken);
                setBearerToken(bearerToken);
            }).then(() => {
                typeof cb == "function" && cb();
            }).catch((err) => {
                console.debug('catch error in LoginWithAuthorizationCode', err);
                //@johan error message exists here 
                setState({ errorMessage: err.message });
                // but couldn't set to the state??
                console.log('get errorMessage from state', state.errorMessage);
                return false;
            });
        return getAccessToken();
    }

    
    const logout = (cb) => {
        setState({
            accessToken: null,
            refreshToken: null,
            user: null,
        });

        // remove the items localStorage.setItem('user', null); would be (string) "null"
        storage.removeItem(KEY_REFRESH_TOKEN);
        storage.removeItem(KEY_ACCESS_TOKEN);
        storage.removeItem(KEY_USER_STATE);
        storage.removeItem(KEY_EXPIRES_IN);
        storage.removeItem(KEY_REDIRECT);
        typeof cb == "function" && cb();
    };

    

    // Return the user object and auth methods

    return {
        state,
        user,
        redirect,
        RedirectAfterLogin,
        SaveRedirect,
        LoginWithAuthorizationCode,
        authExpire,
        accessToken,
        refreshToken,
        invalidateToken,
        getToken,
        getAccessToken,
        getRefreshToken,
        UseRefreshToken,
        test,
        logout
    };
}