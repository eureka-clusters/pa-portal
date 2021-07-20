import React, { useContext, useEffect } from 'react';
import { UserContext } from "../context/UserContext";
import { Redirect } from 'react-router';

export default function Logout(props) {

    const { logout } = useContext(UserContext);

    useEffect(() => {
        logout();
    });

    return <Redirect to="/login" />
}