import React, { useEffect, useState } from "react";

export const UserContext = React.createContext({});

export const UserContextProvider = ({ children }) => {

    const [accessToken, setAccessToken] = useState(null);
    const [hasUser, setHasUser] = useState(false);
    const [refreshToken, setRefreshToken] = useState(null);

    return (
        <UserContext.Provider
            value={{
                accessToken: accessToken,
                refreshToken: refreshToken,
                hasUser: hasUser,
                setHasUser,
                setAccessToken,
                setRefreshToken,
                logout: () => {
                    setHasUser(false);
                    setAccessToken(null);
                    setRefreshToken(null);
                }
            }}>
            {children}
        </UserContext.Provider>
    )
};