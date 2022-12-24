import {createContext, useState} from "react";

/**
 * Script taken from: https://www.bigbinary.com/blog/handling-authentication-state-in-react-native
 *
 * https://blog.logrocket.com/react-native-jwt-authentication-using-axios-interceptors/
 */
const AuthContext = createContext<AuthContextContent>({} as AuthContextContent);

interface AuthContextContent {
    saveAuthState: (authState: AuthState) => void,
    getAuthState: () => AuthState,
    isAuthenticated: () => boolean,
    getToken: () => string | null,
    getClientId: () => string | null,
    logout: () => void
}

export interface AuthState {
    jwtToken: string | null,
    clientId: string | null,
    authenticated: boolean,
}

const AuthProvider = ({children}: { children: any }) => {

    let storage = localStorage;

    const [authState, setAuthState] = useState<AuthState>({
        jwtToken: 'token',
        clientId: 'client',
        authenticated: false,
    });

    const logout = async () => {
        storage.removeItem('authState');
        setAuthState({
            jwtToken: null,
            clientId: null,
            authenticated: false,
        });
    };

    const saveAuthState = (authState: AuthState) => {
        storage.setItem('authState', JSON.stringify(authState));

        setAuthState(authState);
    };

    const getAuthState = () : AuthState => {
        const authState = storage.getItem('authState');

        if (authState) {
            return JSON.parse(authState);
        }

        return {} as AuthState;
    }

    //Funcion which returns the auth state from the local storage
    
    const isAuthenticated  = (): boolean => {
        if (null === getAuthState()) {
            return false;
        }

        return getAuthState()!.authenticated;
    }

    const getToken = () => {
        return getAuthState().jwtToken;
    }

    const getClientId = () => {
        return getAuthState().clientId;
    }

    return (
        <AuthContext.Provider
            value={{isAuthenticated, getAuthState, saveAuthState, getToken, getClientId, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider};

export type {AuthContextContent};