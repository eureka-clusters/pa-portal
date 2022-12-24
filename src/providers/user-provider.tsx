import {createContext, useState} from "react";
import {User} from "interface/auth/user";
import axios from "axios";
import {getServerUri} from "../functions/get-server-uri";

/**
 * Script taken from: https://www.bigbinary.com/blog/handling-authentication-state-in-react-native
 *
 * https://blog.logrocket.com/react-native-jwt-authentication-using-axios-interceptors/
 */
const AuthContext = createContext<AuthContextContent>({} as AuthContextContent);

interface AuthContextContent {
    authState: AuthState,
    setAuthState: (authState: AuthState) => void,
    getToken: () => string | null,
    getUser: () => any,
    logout: () => void
}

export interface AuthState {
    accessToken: string | null,
    refreshToken: string | null,
    authenticated: boolean,
}

const AuthProvider = ({children}: { children: any }) => {

    let storage = localStorage;

    const [authState, setAuthState] = useState<AuthState>({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
    });

    const logout = async () => {
        await storage.removeItem('token');
        setAuthState({
            accessToken: null,
            refreshToken: null,
            authenticated: false,
        });
    };

    const getToken = () => {
        return authState.accessToken;
    }

    function getUser() {
        return axios.get<User>(getServerUri() + '/api/me', {
            headers: {
                'Authorization': 'Bearer ' + getToken()
            }
        }).then((response) => {

            return response.data;
        });
    }

    return (
        <AuthContext.Provider
            value={{authState, setAuthState, getToken, getUser, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider};

export type {AuthContextContent};