import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiStates, Api } from '../../function/Api'
import PrintObject from '../../function/react-print-object';

import './projects.scss'

export default function Projects(props) {

    const [url, setUrl] = React.useState('/list/project');

    const { state, error, data, load } = Api(url);

    switch (state) {
        case apiStates.ERROR:
            return <p>ERROR: {error || 'General error'}</p>;
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <h1>Projects</h1>

                    <h2>Debug</h2>
                    <PrintObject value={data} />

                    <Table size="sm">
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data._embedded.project.map((project) => (
                                <tr>
                                    <td>{project.number} </td>
                                    <td><Link to={`/project/${project.identifier}/${project.name}`}>{project.name}</Link></td>
                                </tr>
                            ))}

                        </tbody>
                    </Table>
                </React.Fragment>
            );
        default:
            return <p>Loading projects...</p>;
    }
}