import React, {useEffect} from 'react';
import { useAuth} from "context/user-context";
import {Redirect} from 'react-router';

export default function Logout() {

    const auth = useAuth();

    // auth.logout();
    // useeffect required otherwise a manual call of /logout would create a warning 
    // Warning: Cannot update a component(`ProvideAuth`) while rendering a different component(`Logout`).To locate the bad setState() call inside`Logout`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render
    useEffect(() => {
        auth.logout();
    });

    return <Redirect to="/"/>
}