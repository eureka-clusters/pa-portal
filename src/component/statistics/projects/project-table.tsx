import React, {FC} from 'react';
import {ApiError, apiStates, getFilter} from 'function/api';
import {Link} from "react-router-dom";
import DataTable from 'component/database-table/index';
import {CostsFormat, EffortFormat} from 'function/utils';
import {GetResults} from "function/api/statistics/project/get-results";
import {Project} from "interface/project";

interface Props {
    filter: any,
}

const ProjectTable: FC<Props> = ({ filter }) => {


    const [perPage, setPerPage] = React.useState(30); // default pageSize
    const [loading, setLoading] = React.useState(false);

    const { state, error, projects, load, pageCount, pageSize, page, totalItems } = GetResults({ filter: getFilter(filter), page: 1, pageSize: perPage });

    const handlePageChange = async (page: number = 1) => {
        setLoading(true);
        await load({
            filter: getFilter(filter),
            page: page,
            pageSize: perPage
        });
        setLoading(false);
    };

    const handlePerRowsChange = async (perPage: any, page: any) => {
        setLoading(true);
        await load({
            filter: getFilter(filter),
            page: page,
            pageSize: perPage
        });
        setPerPage(perPage);
        setLoading(false);
    };

    const columns = [
        {
            id: 'number',
            name: 'Number',
            selector: (project: Project) => project.number,
            sortable: true,
        },
        {
            id: 'name',
            name: 'Name',
            selector: (project: Project) => project.name,
            format: (project: Project) => <Link to={`/project/${project.slug}`}
                                                title={project.name}>{project.name}</Link>,
            sortable: true,
        },
        {
            id: 'primaryCluster',
            name: 'Primary Cluster',
            selector: (project: Project) => project.primaryCluster ? project.primaryCluster.name : '',
            sortable: true,
        },
        {
            id: 'secondaryCluster',
            name: 'Secondary Cluster',
            selector: (project: Project) => project.secondaryCluster ? project.secondaryCluster.name : '',
            sortable: true,
        },
        {
            id: 'status',
            name: 'Status',
            selector: (project: Project) => project.status ? project.status.status : '',
            sortable: true,
        },
        {
            id: 'latestVersion',
            name: 'Latest version',
            selector: (project: Project) => project.latestVersion && project.latestVersion.type ? project.latestVersion.type.type : '',
            sortable: true,
        },
        {
            id: 'latestVersionTotalCosts',
            name: 'Total Costs',
            selector: (project: Project) => project.latestVersionTotalCosts,
            format: (project: Project) => <CostsFormat value={project.latestVersionTotalCosts}/>,
            sortable: true,
            reorder: true
        },
        {
            id: 'latestVersionTotalEffort',
            name: 'Total Effort',
            selector: (project: Project) => project.latestVersionTotalEffort,
            format: (project: Project) => <EffortFormat value={project.latestVersionTotalEffort}/>,
            sortable: true,
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
                    />
                </React.Fragment>
            );
        default:
            return <p>Loading data...</p>;
    }
}

export default ProjectTable;