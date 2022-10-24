import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import BreadcrumbTree from 'component/partial/breadcrumb-tree';
import DataTable from 'component/database-table';
import {useOrganisations} from 'hooks/api/organisation/use-organisations';
import {ApiStates, RenderApiError} from "hooks/api/api-error";

import {Organisation} from "interface/organisation";


export default function Organisations() {

    const [perPage, setPerPage] = useState(30); // default pageSize
    const [loading, setLoading] = useState(false);

    const [sort, setSort] = useState('organisation.name'); // default sort
    const [order, setOrder] = useState('asc'); // default order

    // store the current page (needed for handleSort)
    const [currentPage, setCurrentPage] = useState(1); // default current page

    const {
        state,
        error,
        organisations,
        load,
        // pageCount,
        pageSize,
        // page,
        totalItems
    } = useOrganisations({filter: '', page: 1, pageSize: perPage});

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

    const loadAsync = async () => {
        setLoading(true);
        await load({
            page: currentPage,
            pageSize: perPage,
            sort,
            order
        });
        setLoading(false);
    };

    useEffect(() => {
        loadAsync();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, perPage, sort, order]);

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


    switch (state) {
        case ApiStates.ERROR:
            return <RenderApiError error={error}/>
        case ApiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <pre className='debug'>{JSON.stringify(organisations, undefined, 2)}</pre> */}
                    <BreadcrumbTree current="organisations" data={organisations} linkCurrent={false}/>

                    <h1>Organisations</h1>
                    <DataTable
                        // title="Organisations"
                        keyField="organisation.id"
                        columns={columns}
                        data={organisations}


                        defaultSortFieldId={sort}
                        defaultSortAsc={order === 'asc'}

                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationPerPage={pageSize}
                        paginationTotalRows={totalItems}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                        sortServer
                        onSort={handleSort}
                    />
                </React.Fragment>
            );
        default:
            return <p>Loading organisations...</p>;
    }
}