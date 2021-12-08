import React from 'react';
import {Link} from 'react-router-dom';
import BreadcrumbTree from 'component/partial/breadcrumb-tree';
import DataTable from 'component/database-table/index';
import {ApiError, apiStates, GetOrganisations} from "function/api/get-organisations";
import {Organisation} from "interface/organisation";

export default function Organisations() {

    const {state, error, organisations} = GetOrganisations()

    const columns = [
        {
            id: 'id',
            name: 'Id',
            selector: (organisation: Organisation) => organisation.id,
            sortable: true,
            omit: true,
        },
        {
            id: 'name',
            name: 'Organisation',
            selector: (organisation: Organisation) => organisation.name,
            format: (organisation: Organisation) => <Link to={`/organisation/${organisation.slug}`}
                                                          title={organisation.name}>{organisation.name}</Link>,
            sortable: true,
        },
        {
            id: 'country',
            name: 'Country',
            selector: (organisation: Organisation) => organisation.country ? organisation.country.country : '',
            sortable: true,
        },
        {
            id: 'type',
            name: 'Type',
            selector: (organisation: Organisation) => organisation.type ? organisation.type.type : '',
            sortable: true,
        },
    ];


    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error}/>
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}
                    <BreadcrumbTree current="organisations" data={organisations} linkCurrent={false}/>

                    <h1>Organisations</h1>
                    <DataTable
                        // title="Organisations"
                        keyField="id"
                        columns={columns}
                        data={organisations}
                    />
                </React.Fragment>
            );
        default:
            return <p>Loading organisations...</p>;
    }
}