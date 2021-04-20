import React, {useContext} from 'react';
import Config from "../constants/Config";
import {UserContext} from "../context/UserContext";

export default function Download(props) {

    const serverUri = Config.SERVER_URI;

    const {accessToken} = useContext(UserContext);

    console.log(props.filter)

    return (
        <h1>Project</h1>
    );
}