import React, { useState } from "react";

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
                setBearerToken: (bearerToken) => {
                    setAccessToken(bearerToken.access_token);
                    setRefreshToken(bearerToken.refresh_token);
                    setHasUser(true)
                },
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