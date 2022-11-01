import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import BreadcrumbTree from 'component/partial/breadcrumb-tree';
import DataTable from 'component/database-table';

import {usePartners} from 'hooks/api/partner/use-partners';
import {Partner} from "interface/project/partner";
import {CostsFormat, EffortFormat} from 'function/utils';
import {ApiStates, RenderApiError} from "hooks/api/api-error";


export default function Partners() {

    const [perPage, setPerPage] = useState(30); // default pageSize
    const [loading, setLoading] = useState(false);

    const [sort, setSort] = useState('partner.organisation.name'); // default sort
    const [order, setOrder] = useState('asc'); // default order

    // store the current page (needed for handleSort)
    const [currentPage, setCurrentPage] = useState(1); // default current page


    const {
        state,
        error,
        partners,
        load,
        // pageCount,
        pageSize,
        // page,
        totalItems
    } = usePartners({page: 1, pageSize: perPage});

    const handlePageChange = async (newpage: number = 1) => {
        setCurrentPage(newpage);
    }

    const handleSort = async (column: any, sortDirection: string) => {
        setSort(column.sortField);
        setOrder(sortDirection);
    };

    const handlePerRowsChange = async (perPage: number) => {
        setPerPage(perPage);
    };

    useEffect(() => {
        setLoading(true);
        load({
            page: currentPage,
            pageSize: perPage,
            sort,
            order
        });
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, perPage, sort, order]);

    const columns = [
        {
            id: 'partner.id',
            name: 'Id',
            selector: (row: Partner) => row.id,
            sortable: true,
            omit: true,
            sortField: 'partner.id',
        },
        {
            id: 'organisation.name',
            name: 'Partner',
            selector: (row: Partner) => row.organisation.name,
            format: (row: Partner) => <Link to={`/partner/${row.slug}`}
                                            title={row.organisation.name}>{row.organisation.name}</Link>,
            sortable: true,
            sortField: 'organisation.name',
        },
        // {
        //     id: 'organisation.name',
        //     name: 'Organisation',
        //     selector: (row: Partner) => row.organisation.name,
        //     format: (row: Partner) => <Link to={`/organisation/${row.organisation.slug}`}
        //         title={row.organisation.name}>{row.organisation.name}</Link>,
        //     sortable: true,
        //     sortField: 'organisation.name',
        // },
        {
            id: 'project.name',
            name: 'Project',
            selector: (row: Partner) => row.project.name,
            format: (row: Partner) => <Link to={`/project/${row.project.slug}`}
                                            title={row.project.name}>{row.project.name}</Link>,
            sortable: true,
            sortField: 'project.name',
        },

        {
            id: 'organisation.country.country',
            name: 'Country',
            selector: (row: Partner) => row.organisation.country ? row.organisation.country.country : '',
            sortable: true,
            sortField: 'organisation.country.country',
        },
        {
            id: 'organisation.type.type',
            name: 'Type',
            selector: (row: Partner) => row.organisation.type ? row.organisation.type.type : '',
            sortable: true,
            sortField: 'organisation.type.type',
        },

        {
            id: 'partner_costs',
            name: 'Partner Costs (€)',
            selector: (row: Partner) => row.latestVersionCosts,
            format: (row: Partner) => <CostsFormat value={row.latestVersionCosts} showSuffix={false}
                                                   showPrefix={false}/>,
            sortable: true,
            right: true,
        },
        {
            id: 'partner_effort',
            name: 'Partner Effort (PY)',
            selector: (row: Partner) => row.latestVersionEffort,
            format: (row: Partner) => <EffortFormat value={row.latestVersionEffort} showSuffix={false}
                                                    showPrefix={false}/>,
            sortable: true,
            right: true,
        },
    ];


    switch (state) {
        case ApiStates.ERROR:
            return <RenderApiError error={error}/>
        case ApiStates.SUCCESS:
            return (
                <React.Fragment>
                    <BreadcrumbTree current="partners" data={partners} linkCurrent={false}/>
                    {/* <pre className='debug'>{JSON.stringify(partners, undefined, 2)}</pre> */}
                    <h1>Partners</h1>
                    <h3>sorting not yet possible</h3>
                    <DataTable
                        keyField="partner.id"
                        columns={columns}
                        data={partners}

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
            return <p>Loading partners...</p>;
    }
}