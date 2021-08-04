// ./MeAxios.js
import React from 'react';
import { apiStates, useApiAxios } from '../../function/useApiAxios'

export const MeAxios = () => {

    const url = '/me';
    const { state, error, data } = useApiAxios(url);

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

export default MeAxios