import React from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiStates, Api, ApiError } from '../../function/Api';
import BreadcrumbTree from '../partial/BreadcrumbTree';
import DataTable from '../DataTableBase';
import { CostsFormat, EffortFormat } from '../../function/utils';


export default function Organisations(props) {

    const { state, error, data } = Api('/list/organisation');

    const columns = [
        {
            id: 'id',
            name: 'Id',
            selector: row => row.id,
            sortable: true,
            omit: true,
        },
        {
            id: 'name',
            name: 'Organisation',
            selector: row => row.name,
            format: row => <Link to={`/organisation/${row.slug}`} title={row.name} >{row.name}</Link>,
            sortable: true,
        },
        {
            id: 'country',
            name: 'Country',
            selector: row => row.country ? row.country.country : '',
            sortable: true,
        },
        {
            id: 'type',
            name: 'Type',
            selector: row =>  row.type ? row.type.type : '',
            sortable: true,
        },
    ];


    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}
                    <BreadcrumbTree current="organisations" data={data} linkCurrent={false} />

                    <DataTable
                        title="Organisations"
                        keyField="id"
                        columns={columns}
                        data={data._embedded.organisation}
                    />

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
                                    <td><Link to={`/organisation/${organisation.slug}`}>{organisation.name}</Link></td>
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