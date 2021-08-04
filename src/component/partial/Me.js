// ./Me.js
import React from 'react';
import { apiStates, useApi } from '../../function/useApi'
import Config from "../../constants/Config";


export const Me = () => {

    const serverUri = Config.SERVER_URI;
    const url = serverUri + '/api/me';

    const { state, error, data } = useApi(url);

    switch (state) {
        case apiStates.ERROR:
            return <p>ERROR: {error || 'General error'}</p>;
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <p>Data:</p>
                    <ul>
                        <li>{data.first_name}</li>
                        <li>{data.last_name}</li>
                        <li>{data.email}</li>
                    </ul>
                    
                </React.Fragment>
            );
        default:
            return <p>loading..</p>;
    }
};

export default Me