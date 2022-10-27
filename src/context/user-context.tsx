import {createContext, FC, useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {UserInfo} from 'interface/auth/user-info';
import jwtDecode, {JwtPayload} from "jwt-decode";
import {configureAxiosHeaders} from "../function/configure-axios-headers";
import axios from "axios";


const AuthContext = createContext<any>({}); //Any, might be replaced by more strict objects

export const KEY_USER = 'user';
export const KEY_USER_INFO = 'UserInfo';
export const KEY_REDIRECT = 'redirect';
export const KEY_TOKEN = 'token';

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

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [token, setToken] = useState<string | null>(null)

    const getUserInfo = () => {
        let UserInfo = storage.getItem(KEY_USER_INFO);

        if (UserInfo) {
            return JSON.parse(UserInfo);
        }
        return null;
    }

    const logout = () => {

        setUserInfo(null);
        setToken(null);
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

    const getJwtToken = (): string | null => {

        checkToken(token);

        if (checkToken(token)) {
            return token;
        }

        return null;
    }


    const hasUser = () => {

        const token = storage.getItem(KEY_TOKEN);

        if (null !== token) {
            configureAxiosHeaders(token);
        }

        return null !== getUserInfo();
    }

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get('/me')
            setUserInfo(response.data)

            storage.setItem(KEY_USER, response.data)
            storage.setItem(KEY_USER_INFO, JSON.stringify(response.data));
        } catch (err) {

        } finally {

        }
    }

    const loginWithToken = async (token: string) => {

        // use token to get the UserInfo (if this succeeds the token is valid)
        configureAxiosHeaders(token);
        setToken(token);

        storage.setItem(KEY_TOKEN, token);

        try {

            await fetchUserInfo();

            return true;
        } catch (error: any) {

        }
    }


    const redirectAfterLogin = () => {
        navigate('');
    }


    return {
        // states

        // storage functions
        hasUser,
        getJwtToken,
        getUserInfo,

        // other functions
        logout,
        loginWithToken,

        redirectAfterLogin
    }
}