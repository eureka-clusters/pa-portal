import React from 'react';
import {Link} from 'react-router-dom';
import BreadcrumbTree from 'component/partial/breadcrumb-tree'
import DataTable from 'component/database-table/index';
import {Project} from "interface/project";
import {CostsFormat, EffortFormat} from 'function/utils';
import {ApiError, apiStates, GetProjects} from "function/api/get-projects";
import useState from 'react-usestateref';

export default function Projects() {

    const [perPage, setPerPage] = React.useState(30); // default pageSize
    const [loading, setLoading] = React.useState(false);

    const [sort, setSort, sort_ref] = useState('project.name'); // default sort
    const [order, setOrder, order_ref] = useState('asc'); // default order

    // store the current page (needed for handleSort)
    const [currentPage, setCurrentPage] = useState(1); // default current page

    const {state, error, projects, load, pageCount, pageSize, page, totalItems} = GetProjects({
        page: 1,
        pageSize: perPage
    });

    const handlePageChange = async (newpage: number = 1) => {
        setCurrentPage(newpage);
        setLoading(true);
        await load({
            page: newpage,
            pageSize: perPage,
            sort: sort_ref.current,
            order: order_ref.current
        });
        setLoading(false);
    };

    const handlePerRowsChange = async (perPage: any, page: any) => {
        setLoading(true);
        await load({
            page: page,
            pageSize: perPage,
            sort: sort,
            order: order
        });
        setPerPage(perPage);
        setLoading(false);
    };

    const handleSort = async (column: any, sortDirection: any) => {
        let sortField = column.sortField;
        setSort(sortField);
        setOrder(sortDirection);
        if (currentPage === 1) {
            await load({
                page: 1,
                pageSize: perPage,
                sort: sortField,
                order: sortDirection
            });
        }
    };

    const columns = [
        {
            name: '#',
            cell: (row: any, index: any) => index,
            grow: 0,
        },
        {
            id: 'project.number',
            name: 'Number',
            selector: (row: Project) => row.number,
            sortable: true,
            sortField: 'project.number',
        },
        {
            id: 'project.name',
            name: 'Name',
            selector: (row: Project) => row.name,
            format: (row: Project) => <Link to={`/project/${row.slug}`} title={row.name}>{row.name}</Link>,
            sortable: true,
            sortField: 'project.name',
        },
        {
            id: 'project.primaryCluster.name',
            name: 'Primary Cluster',
            selector: (row: Project) => row.primaryCluster ? row.primaryCluster.name : '',
            sortable: true,
            sortField: 'project.primaryCluster.name',
        },
        {
            id: 'project.secondaryCluster.name',
            name: 'Secondary Cluster',
            selector: (row: Project) => row.secondaryCluster ? row.secondaryCluster.name : '',
            sortable: true,
            sortField: 'project.secondaryCluster.name',
        },
        {
            id: 'project.status.status',
            name: 'Status',
            selector: (row: Project) => row.status ? row.status.status : '',
            sortable: true,
            sortField: 'project.status.status',
        },
        {
            id: 'project.latestVersion.type.type',
            name: 'Latest version',
            selector: (row: Project) => row.latestVersion && row.latestVersion.type ? row.latestVersion.type.type : '',
            sortable: true,
            sortField: 'project.latestVersion.type.type',
        },
        {
            id: 'project.latestVersionTotalCosts',
            name: 'Total Costs',
            selector: (row: Project) => row.latestVersionTotalCosts,
            format: (row: Project) => <CostsFormat value={row.latestVersionTotalCosts}/>,
            sortable: true,
            sortField: 'project.latestVersionTotalCosts',
        },
        {
            id: 'project.latestVersionTotalEffort',
            name: 'Total Effort',
            selector: (row: Project) => row.latestVersionTotalEffort,
            format: (row: Project) => <EffortFormat value={row.latestVersionTotalEffort}/>,
            sortable: true,
            sortField: 'project.latestVersionTotalEffort',
        },
    ];

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error}/>
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <BreadcrumbTree current="projects" data={{}} linkCurrent={false}/>
                    {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}
                    <h1>Projects</h1>
                    <DataTable
                        // title="Projects"
                        keyField="number"
                        columns={columns}
                        data={projects}
                        defaultSortFieldId={sort_ref.current}
                        defaultSortAsc={order_ref.current === 'asc' ? true : false}
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
            return <p>Loading projects...</p>;
    }
}