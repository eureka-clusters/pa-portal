import React from 'react';
import {Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {ApiError, apiStates, GetPartners} from "function/api/get-partners";

export default function Partners() {

    const {state, error, partners} = GetPartners({});

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error}/>
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
                        {partners.map((partner, i: React.Key) => (
                            <tr key={i}>
                                <td><Link to={`/partner/${partner.slug}`}>{partner.organisation.name}</Link></td>
                                <td>{partner.organisation.type}</td>
                                <td>{partner.organisation.country.country}</td>
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