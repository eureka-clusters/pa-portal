import React, { useContext, useEffect } from 'react';
import Config from "../constants/Config";
import { UserContext } from "../context/UserContext";

export default function Callback(props) {

    const { setAccessToken, setRefreshToken, setHasUser } = useContext(UserContext);

    const token = atob(props.match.params.code);
    
    const accessToken = JSON.parse(token)['access_token'];
    const refreshToken = JSON.parse(token)['refresh_token'];

    useEffect(() => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setHasUser(true);
    }, [accessToken, refreshToken, setAccessToken, setRefreshToken, setHasUser]);

    return (
        <div className="container">
            <pre>
           {token}
           </pre>
        </div>
    );
}