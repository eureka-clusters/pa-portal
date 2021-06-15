import React, {useContext} from 'react';
import Config from "../constants/Config";
import {UserContext} from "../context/UserContext";

export default function Download(props) {

    const serverUri = Config.SERVER_URI;

    const {accessToken} = useContext(UserContext);

    return (
        <h1>Partner</h1>
    );
}