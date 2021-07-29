import React from 'react';

import { useAuth } from "../../context/UserContext";

export default function Project(props) {

    let auth = useAuth();

    return (
        <React.Fragment>
            <h1>Project Page</h1>
            User = {auth.user}<br />
            AccessToken = {auth.accessToken} <br />
            RefreshToken = {auth.refreshToken} <br />
        </React.Fragment>
    );
}