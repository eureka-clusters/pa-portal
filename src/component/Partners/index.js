import React from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiStates, Api, ApiError } from 'function/Api';

export default function Partners(props) {

    const { state, error, data } = Api('/list/partner');

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* @johan is this page still used? */}
                    <h1>Partners</h1>

                    <Table size="sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Country</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data._embedded.partner.map((partner, i) => (
                                <tr key={i}>
                                    <td><Link to={`/partner/${partner.slug}`}>{partner.name}</Link></td>
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