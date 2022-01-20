import React, {FC} from 'react';
import {ApiError, apiStates, getFilter} from 'function/api';
import {Link} from "react-router-dom";
import DataTable from 'component/database-table/index';
import {CostsFormat, EffortFormat} from 'function/utils';
import {GetResults} from "function/api/statistics/project/get-results";
import {Project} from "interface/project";
import useState from 'react-usestateref';

interface Props {
    filter: any,
}

const ProjectTable: FC<Props> = ({ filter }) => {

    const [perPage, setPerPage] = useState(30); // default pageSize
    const [loading, setLoading] = useState(false);

    const [sort, setSort, sort_ref] = useState('partner.organisation.name'); // default sort
    const [order, setOrder, order_ref] = useState('asc'); // default order

    // store the current page (needed for handleSort)
    const [currentPage, setCurrentPage] = useState(1); // default current page

    const { state, error, projects, load, pageCount, pageSize, page, totalItems } = GetResults({ filter: getFilter(filter), page: 1, pageSize: perPage });

    const handlePageChange = async (newpage: number = 1) => {
        setCurrentPage(newpage);
        setLoading(true);
        await load({
            filter: getFilter(filter),
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
        let sortField = column.sortField;
        setSort(sortField);
        setOrder(sortDirection);
        if (currentPage === 1) {
            await load({
                filter: getFilter(filter),
                page: 1,
                pageSize: perPage,
                sort: sortField,
                order: sortDirection
            });
        }
    };

    const columns = [
        {
            id: 'number',
            name: 'Number',
            selector: (project: Project) => project.number,
            sortable: true,
            sortField: 'project.number',
        },
        {
            id: 'name',
            name: 'Name',
            selector: (project: Project) => project.name,
            format: (project: Project) => <Link to={`/project/${project.slug}`}
                                                title={project.name}>{project.name}</Link>,
            sortable: true,
            sortField: 'project.name',
        },
        {
            id: 'primaryCluster',
            name: 'Primary Cluster',
            selector: (project: Project) => project.primaryCluster ? project.primaryCluster.name : '',
            sortable: true,
            sortField: 'project.primaryCluster.name',
        },
        {
            id: 'secondaryCluster',
            name: 'Secondary Cluster',
            selector: (project: Project) => project.secondaryCluster ? project.secondaryCluster.name : '',
            sortable: true,
            sortField: 'project.secondaryCluster.name',
        },
        {
            id: 'status',
            name: 'Status',
            selector: (project: Project) => project.status ? project.status.status : '',
            sortable: true,
            sortField: 'project.status.status',
        },
        {
            id: 'latestVersion',
            name: 'Latest version',
            selector: (project: Project) => project.latestVersion && project.latestVersion.type ? project.latestVersion.type.type : '',
            sortable: true,
            sortField: 'project.latestVersion.type.type',
        },
        {
            id: 'latestVersionTotalCosts',
            name: 'Total Costs',
            selector: (project: Project) => project.latestVersionTotalCosts,
            format: (project: Project) => <CostsFormat value={project.latestVersionTotalCosts}/>,
            sortable: true,
            reorder: true,
            sortField: 'project.latestVersionTotalCosts',
        },
        {
            id: 'latestVersionTotalEffort',
            name: 'Total Effort',
            selector: (project: Project) => project.latestVersionTotalEffort,
            format: (project: Project) => <EffortFormat value={project.latestVersionTotalEffort}/>,
            sortable: true,
            sortField: 'project.latestVersionTotalEffort',
        },
    ];

    

    switch (state) {
        case apiStates.ERROR:
            return (
                <>
                    <ApiError error={error}/>
                    <br/><br/>Filter used <code className={'pb-2 text-muted'}>{getFilter(filter)}</code>
                </>
            );
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <h2>Projects</h2>
                    {/* <pre className='debug'>{JSON.stringify(filter, undefined, 2)}</pre> */}
                    <DataTable
                        // title="Projects"
                        keyField="number"
                        columns={columns}
                        data={projects}

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

export default ProjectTable;