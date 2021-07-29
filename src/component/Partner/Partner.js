import React from 'react';
// import Config from "../constants/Config";
import { useAuth } from "../../context/UserContext";

export default function Download(props) {
    
    let auth = useAuth();
    
    return (
        <React.Fragment>
            <h1>Partner Page</h1>
            User = {auth.user}<br />
            AccessToken = {auth.accessToken} <br />
            RefreshToken = {auth.refreshToken} <br />
        </React.Fragment>
    );
}