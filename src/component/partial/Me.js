// ./Me.js
import React from 'react';
import { useMe, apiStates } from 'hooks/api/user/use-me'
import Button from 'react-bootstrap/Button'

export const Me = () => {
    // eslint-disable-next-line no-unused-vars
    const { state, error, data, load } = useMe();

    switch (state) {
        case apiStates.ERROR:
            return <p>ERROR: {error.message || 'General error'}</p>;
        case apiStates.SUCCESS:
            
            return (
                <React.Fragment>
                    <ul>
                        <li>{data.first_name}</li>
                        <li>{data.last_name}</li>
                        <li>{data.email}</li>
                    </ul>
                    <Button onClick={() => load()}>reload current url load() </Button>
                </React.Fragment>
            );
        default:
            return <p>loading..</p>;
    }
};

export default Me