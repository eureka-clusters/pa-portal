import React, {useEffect} from 'react';
import {UseAuth} from "../../context/UserContext";
import {Redirect} from 'react-router';

export default function Logout() {

    const auth = UseAuth();

    useEffect(() => {
        auth.logout();
    });

    return <Redirect to="/"/>
}