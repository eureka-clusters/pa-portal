// ./Me.js
import React, {useContext} from 'react';
import {UserContext} from "@/providers/user-provider";

export const Me = () => {
    const userContext = useContext(UserContext);
    const userInfo = userContext.getUser();

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