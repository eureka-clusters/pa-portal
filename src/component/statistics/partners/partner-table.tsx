import React, {FC} from 'react';
import {ApiError, apiStates, getFilter} from 'function/api';
import {Link} from "react-router-dom";
import DataTable from 'component/database-table/index';
import {CostsFormat, EffortFormat} from 'function/utils';
import {Partner} from "interface/project/partner";
import {GetResults} from "function/api/statistics/partner/get-results";

interface Props {
    filter: any
}

const PartnerTable: FC<Props> = ({filter}) => {

    const [perPage, setPerPage] = React.useState(30); // default pageSize
    const [loading, setLoading] = React.useState(false);
    const [sort, setSort] = React.useState('partner.organisation.name'); // default sort
    const [order, setOrder] = React.useState('asc'); // default order

    const { state, error, partners, load, pageCount, pageSize, page, totalItems } = GetResults({ filter: getFilter(filter), page: 1, pageSize: perPage, sort:sort, order:order });

    const handlePageChange = async (newpage: number = 1) => {
        console.log(['handlePageChange']);

        setLoading(true);
        await load({
            filter: getFilter(filter),
            page: newpage,
            pageSize: perPage,
            sort: sort,
            order: order
        });
        setLoading(false);
    };

    const handlePerRowsChange = async (perPage: any, page: any) => {
        console.log(['handlePerRowsChange']);
        setLoading(true);
        await load({
            filter: getFilter(filter),
            page: page,
            pageSize: perPage,
            sort: sort,
            order: order
        });
        setPerPage(perPage);
        setLoading(false);
    };

    const handleSort = async (column: any, sortDirection: any) => {
        console.log(['handleSort']);
        setLoading(true);
        let sortField = column.sortField;
        console.log(['sortField', sortField]);
        console.log(['sortDirection', sortDirection]);

        setSort(sortField);
        setOrder(sortDirection);

        await load({
            filter: getFilter(filter),
            page : 1,
            pageSize: perPage,
            sort: sortField,
            order: sortDirection
        });
        
        setLoading(false);
    };

    const hasYearFilter = filter.year.length > 0;

    const columns = [
        {
            id: 'id',
            name: 'Id',
            selector: (partner: Partner) => partner.id,
            sortable: true,
            sortField: 'partner.id',
            // sortField: 'project_partner.id',
        },
        {
            id: 'project',
            name: 'Project',
            selector: (partner: Partner) => partner.project.name,
            format: (partner: Partner) => <Link to={`/project/${partner.project.slug}`}
                                                title={partner.project.name}>{partner.project.name}</Link>,
            sortable: true,
            // sortField: 'project.name',
            sortField: 'partner.project.name',
            
        },
        {
            id: 'partner',
            name: 'Partner',
            selector: (partner: Partner) => partner.organisation.name,
            format: (partner: Partner) => <Link to={`/partner/${partner.slug}`}
                                                title={partner.organisation.name}>{partner.organisation.name}</Link>,
            sortable: true,
            sortField: 'partner.organisation.name',
        },
        {
            id: 'country',
            name: 'Country',
            selector: (partner: Partner) => partner.organisation && partner.organisation.country ? partner.organisation.country.country : '',
            sortable: true,
            sortField: 'partner.organisation.country.country',
        },
        {
            id: 'type',
            name: 'Type',
            selector: (partner: Partner) => partner.organisation && partner.organisation.type ? partner.organisation.type.type : '',
            sortable: true,
            sortField: 'partner.organisation.type.type',
        },

        {
            id: 'partner_costs',
            name: 'Partner Costs',
            selector: (partner: Partner) => partner.latestVersionCosts,
            format: (partner: Partner) => <CostsFormat value={partner.latestVersionCosts}/>,
            sortable: true,
            reorder: true,
            omit: hasYearFilter,
            sortField: 'partner.latestVersionCosts',
        },
        {
            id: 'partner_effort',
            name: 'Partner Effort',
            selector: (partner: Partner) => partner.latestVersionEffort,
            format: (partner: Partner) => <EffortFormat value={partner.latestVersionEffort}/>,
            sortable: true,
            omit: hasYearFilter,
            sortField: 'partner.latestVersionEffort',
        },
        {
            id: 'year',
            name: 'Year',
            selector: (partner: Partner) => partner.year,
            sortable: true,
            reorder: true,
            omit: !hasYearFilter,
            sortField: 'partner.year',
        },
        {
            id: 'partner_costs_in_year',
            name: 'Partner Costs in Year',
            selector: (partner: Partner) => partner.latestVersionTotalCostsInYear,
            format: (partner: Partner) => <CostsFormat value={partner.latestVersionTotalCostsInYear}/>,
            sortable: true,
            reorder: true,
            omit: !hasYearFilter,
            sortField: 'partner.latestVersionTotalCostsInYear',
        },
        {
            id: 'partner_effort_in_year',
            name: 'Partner Effort in Year',
            selector: (partner: Partner) => partner.latestVersionTotalEffortInYear,
            format: (partner: Partner) => <EffortFormat value={partner.latestVersionTotalEffortInYear}/>,
            sortable: true,
            omit: !hasYearFilter,
            sortField: 'partner.latestVersionTotalEffortInYear',
        },
    ];


    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error}/>
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <h2>Partners</h2>
                    <DataTable
                        // title="Partners"
                        keyField="id"
                        columns={columns}
                        data={partners}
                        paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100, 200]}

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
            return <p>Loading data...</p>;
    }
}

export default PartnerTable;