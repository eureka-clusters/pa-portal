import React, {createContext, FC, useContext, useState} from 'react';

const AuthContext = createContext<any>({}); //Any, might be replaced by more strict objects

interface Props {
    children: JSX.Element
}

const auth = UseProvideAuth();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export const ProvideAuth: FC<Props> = ({children}) => (
    <AuthContext.Provider value={auth}>
        {children}
    </AuthContext.Provider>
);

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const UseAuth = () => {
    return useContext(AuthContext);
};

function UseProvideAuth() {

    const [jwtToken, setJwtToken] = useState('')

    const getJwtToken = () => {
        return jwtToken;
    }

    return {
        setJwtToken,
        getJwtToken
    }
}