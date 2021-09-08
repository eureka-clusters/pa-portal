import React, { useEffect, useState } from 'react';
import { apiStates, Api } from '../../function/Api'
import Moment from 'react-moment';
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
                    <dl>
                        <dt>Project</dt><dd>{data.name}</dd>
                        <dt>Description</dt><dd>{data.description}</dd>
                        <dt>Label date</dt><dd><Moment format="DD-MM-YYYY">{data.labelDate}</Moment></dd>
                        <dt>Project</dt><dd>{data.name}</dd>
                        <dt>Technical Area</dt><dd>{data.technicalArea}</dd>
                        <dt>Programme</dt><dd>{data.programme}</dd>
                        <dt>Programme Call</dt><dd>{data.programmeCall}</dd>
                        <dt>Primary Cluster</dt><dd>{data.primaryCluster}</dd>
                    </dl>
                </React.Fragment>
            );
        default:
            return <p>Loading project...</p>;
    }
}