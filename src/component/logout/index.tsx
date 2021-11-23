import React, {useEffect} from 'react';
import {UseAuth} from "context/user-context";
import {Redirect} from 'react-router';

export default function Logout() {

    const auth = UseAuth();

    auth.logout();
    useEffect(() => {

    });

    return <Redirect to="/"/>
}