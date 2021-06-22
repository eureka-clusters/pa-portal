import React, { useContext } from 'react';
import Config from "../constants/Config";
import { UserContext } from "../context/UserContext";

export default function Project(props) {

    const { accessToken, refreshToken, hasUser } = useContext(UserContext);

    return (
        <React.Fragment>
            <h1>Project {accessToken} test {refreshToken}</h1>

            <div>{hasUser && <p>Logged In</p>}</div>
        </React.Fragment>
    );
}