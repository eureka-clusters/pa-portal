// ./Me.js
import React from 'react';
import {useAuth} from "../../context/user-context";

export const Me = () => {
    // eslint-disable-next-line no-unused-vars
    const {userInfo, loading, error} = useAuth();

    return (
        <React.Fragment>
            <ul>
                <li>{userInfo.first_name}</li>
                <li>{userInfo.last_name}</li>
                <li>{userInfo.email}</li>
            </ul>

        </React.Fragment>
    );
};

export default Me