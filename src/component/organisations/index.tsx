import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import BreadcrumbTree from 'component/partial/breadcrumb-tree';
import {Organisation} from "interface/organisation";
import {useGetOrganisations} from "hooks/organisation/use-get-organisations";


export default function Organisations() {

    const [perPage, setPerPage] = useState(30); // default pageSize
    const [loading, setLoading] = useState(false);

    const [sort, setSort] = useState('organisation.name'); // default sort
    const [order, setOrder] = useState('asc'); // default order

    // store the current page (needed for handleSort)
    const [currentPage, setCurrentPage] = useState(1); // default current page

    const {state} = useGetOrganisations({page: 1, pageSize: perPage});

    const handlePageChange = async (newpage: number = 1) => {
        setCurrentPage(newpage);
    }

    const handleSort = async (column: any, sortDirection: string) => {
        setSort(column.sortField);
        setOrder(sortDirection);
    };

    const handlePerRowsChange = async (perPage: number, page: number) => {
        setPerPage(perPage);
    };


    const columns = [
        {
            id: 'organisation.id',
            name: 'Id',
            selector: (organisation: Organisation) => organisation.id,
            sortable: true,
            omit: true,
            sortField: 'organisation.id',
        },
        {
            id: 'organisation.name',
            name: 'Organisation',
            selector: (organisation: Organisation) => organisation.name,
            format: (organisation: Organisation) => <Link to={`/organisation/${organisation.slug}`}
                                                          title={organisation.name}>{organisation.name}</Link>,
            sortable: true,
            sortField: 'organisation.name',
            grow: 2,
        },
        {
            id: 'organisation.country.country',
            name: 'Country',
            selector: (organisation: Organisation) => organisation.country ? organisation.country.country : '',
            sortable: true,
            sortField: 'organisation.country.country',
        },
        {
            id: 'organisation.type.type',
            name: 'Type',
            selector: (organisation: Organisation) => organisation.type ? organisation.type.type : '',
            sortable: true,
            sortField: 'organisation.type.type',
        },
    ];

    if (state.isLoading) {
        return <p>Loading organisations...</p>;
    }

    return (
        <React.Fragment>
            {/* <pre className='debug'>{JSON.stringify(organisations, undefined, 2)}</pre> */}
            <BreadcrumbTree current="organisations" data={state.data} linkCurrent={false}/>

            <h1>Organisations</h1>

        </React.Fragment>

    );
}