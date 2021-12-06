import React, {createContext, FC, useContext} from 'react';

const AuthContext = createContext<any>({}); //Any, might be replaced by more strict objects

// interface UserContent {
//     jwtToken: string,
//     user?: string,
// }

interface Props {
    children: JSX.Element
}

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export const ProvideAuth: FC<Props> = ({children}) => {
    const auth = useProvideAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const UseAuth = () => {
    return useContext(AuthContext);
};


function useProvideAuth() {

    let storage = localStorage;

    const logout = () => {
        storage.removeItem('token')
        storage.removeItem('user')
    }

    const setUser = (username: string) => {
        storage.setItem('user', username)
    }

    const hasUser = () => {
        return null !== storage.getItem('user');
    }

    const getUser = () => {
        return storage.getItem('user');
    }

    const setJwtToken = (token: string) => {
        storage.setItem('token', token)
    }

    const getJwtToken = () => {
        return storage.getItem('token')
    }

    return {
        setUser,
        hasUser,
        logout,
        setJwtToken,
        getJwtToken
    }
}