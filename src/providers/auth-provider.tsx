import {createContext, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from "@interfaces/user";

/**
 * Script taken from: https://www.bigbinary.com/blog/handling-authentication-state-in-react-native
 *
 * https://blog.logrocket.com/react-native-jwt-authentication-using-axios-interceptors/
 */
const AuthContext = createContext<AuthContextContent>({} as AuthContextContent);

interface AuthContextContent {
    authState: AuthState,
    setAuthState: (authState: AuthState) => void,
    getJwtToken: () => string | null,
    getUser: () => User,
    logout: () => void
}

interface AuthState {
    jwtToken: string | null,
    authenticated: boolean,
}

const AuthProvider = ({children}: { children: any }) => {

    const [authState, setAuthState] = useState<AuthState>({
        jwtToken: null,
        authenticated: false,
    });


    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setAuthState({
            jwtToken: null,
            authenticated: false,
        });
    };

    const getJwtToken = () => {
        return authState.jwtToken;
    }

    const getUser = () => {

        const user: User = {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            initials: 'JD',
            email: 'info@example.com'
        }

        return user;
    }

    return (
        <AuthContext.Provider
            value={{authState, setAuthState, getJwtToken, getUser, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider, AuthContextContent};