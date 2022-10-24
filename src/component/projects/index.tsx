import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import BreadcrumbTree from 'component/partial/breadcrumb-tree'
import DataTable from 'component/database-table';
import {Project} from "interface/project";
import {CostsFormat, EffortFormat} from 'function/utils';
import { useProjects, apiStates, ApiError } from 'hooks/api/project/use-projects';

import useState from 'react-usestateref';

export default function Projects() {

    const [loading, setLoading] = React.useState(false);
    const [perPage, setPerPage] = React.useState(30);           // default pageSize
    const [sort, setSort, sort_ref] = useState('project.name'); // default sort
    const [order, setOrder, order_ref] = useState('asc');       // default order
    const [currentPage, setCurrentPage] = useState(1);          // default current page

    const { 
        state, 
        error, 
        projects, 
        load, 
        // pageCount, 
        pageSize, 
        // page, 
        totalItems 
    } = useProjects({ filter: '', page: 1, pageSize: perPage });

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
        // {
        //     name: '#',
        //     cell: (row: any, index: any) => index,
        //     grow: 0,
        // },
        {
            id: 'project.slug',
            name: 'slug',
            selector: (row: Project) => row.slug,
            sortable: false,
            omit: true,
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
            grow: 2,
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
            name: 'Total Costs (€)',
            selector: (row: Project) => row.latestVersionTotalCosts,
            format: (row: Project) => <CostsFormat value={row.latestVersionTotalCosts} showSuffix={false} showPrefix={false}/>,
            sortable: true,
            right: true,
            sortField: 'project.latestVersionTotalCosts',
        },
        {
            id: 'project.latestVersionTotalEffort',
            name: 'Total Effort (PY)',
            selector: (row: Project) => row.latestVersionTotalEffort,
            format: (row: Project) => <EffortFormat value={row.latestVersionTotalEffort} showSuffix={false} showPrefix={false}/>,
            sortable: true,
            right: true,
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
                    {/* <pre className='debug'>{JSON.stringify(projects, undefined, 2)}</pre> */}
                    <h1>Projects</h1>
                    <DataTable
                        // title="Projects"
                        keyField="project.slug"
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