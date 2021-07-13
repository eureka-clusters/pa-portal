import React, { useContext, useState } from 'react';
import { UserContext } from "../context/UserContext";
import GetAccessToken from '../function/GetAccessToken';

export default function Callback(props) {

    const { accessToken, refreshToken } = useContext(UserContext);

    const [loggedIn, setLoggedIn] = useState(false);

    const authorizationCode = props.location.search.replace('?code=', '');

    if (!loggedIn) {
        console.log('test: ', authorizationCode);
        GetAccessToken(authorizationCode);

        setLoggedIn(true);
    }

    return (
        loggedIn &&
        <div className="container">
            <pre>
                {accessToken} and {refreshToken}
            </pre>
        </div>
    );
}