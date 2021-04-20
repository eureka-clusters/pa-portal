import React, {useEffect, useState} from "react";

export const UserContext = React.createContext({});

export const UserContextProvider = (props) => {

    const [accessToken, setAccessToken] = useState(null);
    const domContainer = document.getElementById('root')

    useEffect(() => {
        setAccessToken(domContainer.dataset.accesstoken);
    }, [domContainer])

    return (
        <UserContext.Provider
            value={{accessToken: accessToken}}>
            {props.children}
        </UserContext.Provider>
    )
};