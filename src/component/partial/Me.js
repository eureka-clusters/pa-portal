// ./Me.js
import React from 'react';
import { apiStates, Api } from '../../function/Api'
import Button from 'react-bootstrap/Button';
import PrintObject from '../../function/react-print-object';

export const Me = () => {
    const [url, setUrl] = React.useState('/me');

    const { state, error, data, load } = Api(url);

    switch (state) {
        case apiStates.ERROR:
            return <p>ERROR: {error || 'General error'}</p>;
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <p>Debug:</p>
                    <PrintObject value={data} />
                    <p>Data:</p>
                    <ul>
                        <li>{data.first_name}</li>
                        <li>{data.last_name}</li>
                        <li>{data.email}</li>
                    </ul>
                    <Button onClick={() => load()}>reload current url load() </Button>
                    &nbsp;
                    <Button onClick={() => load('/me2')}>load with url load('/me2')</Button>
                    &nbsp;
                    <Button onClick={() => setUrl('/me2')}>set url via component state setUrl('/me2')</Button>
                    &nbsp;
                    <Button onClick={() => setUrl('/me3')}>set url via component state setUrl('/me3')</Button>

                    &nbsp;
                </React.Fragment>
            );
        default:
            return <p>loading..</p>;
    }
};

export default Me