import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../context/UserContext";
import Config from "../constants/Config";

export default function GetAccessToken(accessCode) {

    const serverUri = Config.SERVER_URI;

    const { setBearerToken } = useContext(UserContext);

    console.log('test');

    fetch(
        serverUri + '/oauth',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'client_id': Config.CLIENT_ID,
                'client_secret': Config.CLIENT_SECRET,
                'redirect_uri': Config.REDIRECT_URI,
                'grant_type': 'authorization_code',
                'code': accessCode
            })
        }
    ).then((res) => res.json()).then((res) => setBearerToken(res));
}
