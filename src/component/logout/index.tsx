import React, {useContext, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from "@/providers/auth-provider";

export default function Logout() {

    const authContext = useContext(AuthContext);

    useEffect(() => {
        authContext.logout();
    });

    return <Navigate to="/" replace/>
}