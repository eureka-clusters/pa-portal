import React, {useEffect} from 'react';
import {useAuth} from "context/user-context";
import {Navigate} from 'react-router-dom';

export default function Logout() {

    const auth = useAuth();

    useEffect(() => {
        auth.logout();
    });

    return <Navigate to="/" replace/>
}