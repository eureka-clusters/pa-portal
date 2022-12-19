import {createContext, useState} from "react";
import {User} from "interface/auth/user";

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
    getUser: () => User,
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

    const getUser = () => {

        const user: User = {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            is_funder: false,
            is_eureka_secretariat_staff_member: false,
            funder_country: 'BE',
            funder_clusters: [
                'ITEA',
                'CELTIC_NEXT'
            ],
            email: 'info@example.com'
        }

        return user;
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