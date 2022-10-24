// ./Me.js
import React from 'react';
import {useMe} from 'hooks/api/user/use-me'
import Button from 'react-bootstrap/Button'
import {ApiStates, RenderApiError} from "hooks/api/api-error";

export const Me = () => {
    // eslint-disable-next-line no-unused-vars
    const {state, error, user, load} = useMe();

    switch (state) {
        case ApiStates.ERROR:
            return <RenderApiError error={error}/>
        case ApiStates.SUCCESS:

            return (
                <React.Fragment>
                    <ul>
                        <li>{user.first_name}</li>
                        <li>{user.last_name}</li>
                        <li>{user.email}</li>
                    </ul>
                    <Button onClick={() => load()}>reload current url load() </Button>
                </React.Fragment>
            );
        default:
            return <p>loading..</p>;
    }
};

export default Me