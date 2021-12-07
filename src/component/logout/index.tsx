import React, {useEffect} from 'react';
import { useAuth} from "context/user-context";
import {Redirect} from 'react-router';

export default function Logout() {

    const auth = useAuth();

    auth.logout();
    useEffect(() => {

    });

    return <Redirect to="/"/>
}