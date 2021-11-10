import React from 'react';
import { Link } from 'react-router-dom';
import { apiStates, Api, ApiError } from 'function/Api';
import BreadcrumbTree from 'component/partial/BreadcrumbTree';
import DataTable from 'component/DataTableBase';

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
                    <h1>Organisations</h1>
                    <DataTable
                        // title="Organisations"
                        keyField="id"
                        columns={columns}
                        data={data._embedded.organisation}
                    />
                </React.Fragment>
            );
        default:
            return <p>Loading partners...</p>;
    }
}