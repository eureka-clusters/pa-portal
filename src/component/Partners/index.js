import React from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiStates, Api, ApiError } from '../../function/Api';

export default function Partners(props) {

    const { state, error, data } = Api('/list/partner');

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <h1>partners</h1>

                    <Table size="sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Country</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data._embedded.partner.map((partner) => (
                                <tr>
                                    <td><Link to={`/partner/${partner.identifier}/${partner.name}`}>{partner.name}</Link></td>
                                    <td>{partner.type}</td>
                                    <td>{partner.country}</td>
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