import React from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiStates, Api, ApiError } from '../../function/Api';

export default function Organisations(props) {

    const { state, error, data } = Api('/list/organisation');

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <h1>Organisations</h1>

                    <Table size="sm" striped>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Country</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data._embedded.organisation.map((organisation, key) => (
                                <tr key={key}>
                                    <td><Link to={`/organisation/${organisation.id}/${organisation.name}`}>{organisation.name}</Link></td>
                                    <td>{organisation.type.type}</td>
                                    <td>{organisation.country.country}</td>
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