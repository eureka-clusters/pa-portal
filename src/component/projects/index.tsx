import React from 'react';
import {Link} from 'react-router-dom';
import BreadcrumbTree from 'component/partial/breadcrumb-tree'
import DataTable from 'component/database-table/index';
import {Project} from "interface/project";
import {CostsFormat, EffortFormat} from 'function/utils';
import {ApiError, apiStates, GetProjects} from "function/api/get-projects";

import './projects.scss';

function __delay__(timer: number | undefined) {
    return new Promise<void>(resolve => {
        timer = timer || 2000;
        setTimeout(function () {
            resolve();
        }, timer);
    });
};

export default function Projects() {

    const [perPage, setPerPage] = React.useState(30); // default pageSize
    const [loading, setLoading] = React.useState(false);

    const { state, error, projects, load, pageCount, pageSize, page, totalItems } = GetProjects({page: 1, pageSize: perPage});
    
    const handlePageChange = async (page: number=1) => {
        setLoading(true);
        // await __delay__(2000);
        await load({
            page: page,
            pageSize: perPage
        });
        setLoading(false);
    };

    const handlePerRowsChange = async (perPage: any, page: any) => {
        setLoading(true);
        await load({
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
            selector: (row: Project) => row.number,
            sortable: true,
        },
        {
            id: 'name',
            name: 'Name',
            selector: (row: Project) => row.name,
            format: (row: Project) => <Link to={`/project/${row.slug}`} title={row.name}>{row.name}</Link>,
            sortable: true,
        },
        {
            id: 'primaryCluster',
            name: 'Primary Cluster',
            selector: (row: Project) => row.primaryCluster ? row.primaryCluster.name : '',
            sortable: true,
        },
        {
            id: 'secondaryCluster',
            name: 'Secondary Cluster',
            selector: (row: Project) => row.secondaryCluster ? row.secondaryCluster.name : '',
            sortable: true,
        },
        {
            id: 'status',
            name: 'Status',
            selector: (row: Project) => row.status ? row.status.status : '',
            sortable: true,
        },
        {
            id: 'latestVersion',
            name: 'Latest version',
            selector: (row: Project) => row.latestVersion && row.latestVersion.type ? row.latestVersion.type.type : '',
            sortable: true,
        },
        {
            id: 'latestVersionTotalCosts',
            name: 'Total Costs',
            selector: (row: Project) => row.latestVersionTotalCosts,
            format: (row: Project) => <CostsFormat value={row.latestVersionTotalCosts}/>,
            sortable: true,
            reorder: true
        },
        {
            id: 'latestVersionTotalEffort',
            name: 'Total Effort',
            selector: (row: Project) => row.latestVersionTotalEffort,
            format: (row: Project) => <EffortFormat value={row.latestVersionTotalEffort}/>,
            sortable: true,
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
            return <p>Loading projects...</p>;
    }
}