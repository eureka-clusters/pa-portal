import React, {useEffect} from 'react';
import {useAuth} from "../../context/UserContext";
import {Redirect} from 'react-router';

export default function Logout() {

    const auth = useAuth();

    useEffect(() => {
        auth.logout();
    });

    return <Redirect to="/"/>
}