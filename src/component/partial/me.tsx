// ./Me.js
import React, {useContext} from 'react';
import {AuthContext} from "providers/auth-provider";

export const Me = () => {
    const authContext = useContext(AuthContext);
    const userInfo = authContext.getUser();

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