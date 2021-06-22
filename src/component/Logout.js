import React, { useContext, useEffect } from 'react';
import { UserContext } from "../context/UserContext";

export default function Logout(props) {

    const { logout } = useContext(UserContext);

    useEffect(() => {
        logout();
    });

    return (
        <div className="container">
            <div className="jumbotron">
                <h1 className="display-4">Welcome to Eureka Clusters Backend</h1>
            </div>
            You have logged out successfully
        </div>
    );
}