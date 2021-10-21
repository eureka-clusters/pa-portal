import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiStates, Api, ApiError } from '../../function/Api';
import PrintObject from '../../function/react-print-object';

export default function Organisations(props) {

    const [url, setUrl] = React.useState('/list/organisation');

    const { state, error, data, load } = Api(url);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <h1>Organisations</h1>

                    <Table size="sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Country</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data._embedded.organisation.map((organisation) => (
                                <tr>
                                    <td><Link to={`/organisation/${organisation.id}/${organisation.name}`}>{organisation.name}</Link></td>
                                    <td>{organisation.type}</td>
                                    <td>{organisation.country}</td>
                                </tr>
                            ))}

                        </tbody>
                    </Table>
                </React.Fragment>
            );
        default:
            return <p>Loading partners...</p>;
    }
}