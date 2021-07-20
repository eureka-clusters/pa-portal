import React, { useState } from "react";

export const UserContext = React.createContext({});

export const UserContextProvider = ({ children }) => {

    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [hasUser, setHasUser] = useState(localStorage.getItem('hasUser'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));

    return (
        <UserContext.Provider
            value={{
                accessToken: accessToken,
                refreshToken: refreshToken,
                hasUser: hasUser,
                setBearerToken: (bearerToken) => {

                    localStorage.setItem('refreshToken', bearerToken.refresh_token);
                    localStorage.setItem('accessToken', bearerToken.access_token);
                    localStorage.setItem('hasUser', true);

                    setAccessToken(bearerToken.access_token);
                    setRefreshToken(bearerToken.refresh_token);
                    setHasUser(true)

                    
                },
                logout: () => {
                    setHasUser(false);
                    setAccessToken(null);
                    setRefreshToken(null);

                    localStorage.setItem('refreshToken', null);
                    localStorage.setItem('accessToken', null);
                    localStorage.setItem('hasUser', false);
                }
            }}>
            {children}
        </UserContext.Provider>
    )
};