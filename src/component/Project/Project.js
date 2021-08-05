import React, {useEffect, useState} from 'react';
import { apiStates, Api } from '../../function/Api'
import Button from 'react-bootstrap/Button'
import PrintObject from '../../function/react-print-object'


export default function Project(props) {

    //'/api/view/project/' + identifier,
    const identifier = props.match.params.identifier;
    const [url, setUrl] = React.useState('/view/project/' + identifier);

    const { state, error, data, load } = Api(url);

    switch (state) {
        case apiStates.ERROR:
            return <p>ERROR: {error || 'General error'}</p>;
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <p>Debug:</p>
                    <PrintObject value={data} />

                    <h1>Project Page</h1>
                    Project: {data.name}<br />
                    Description: {data.description}
                    <br />

                    Label date: {data.labelDate}<br />
                    Project: {data.name}<br />
                </React.Fragment>
            );
        default:
            return <p>Loading project...</p>;
    }
}