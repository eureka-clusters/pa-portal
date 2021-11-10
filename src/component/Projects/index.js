import React from 'react';
import { Link } from 'react-router-dom';
import { apiStates, Api, ApiError } from 'function/Api';
import BreadcrumbTree from 'component/partial/BreadcrumbTree'
import './projects.scss';
import DataTable from 'component/DataTableBase';
import { CostsFormat, EffortFormat } from 'function/utils';

export default function Projects(props) {

    const { state, error, data } = Api('/list/project');

    const columns = [
        {
            id: 'number',
            name: 'Number',
            selector: row => row.number,
            sortable: true,
        },
        {
            id: 'name',
            name: 'Name',
            selector: row => row.name,
            format: row => <Link to={`/project/${row.slug}`} title={row.name} >{row.name}</Link>,
            sortable: true,
        },
        {
            id: 'primaryCluster',
            name: 'Primary Cluster',
            selector: row => row.primaryCluster ? row.primaryCluster.name : '',
            sortable: true,
        },
        {
            id: 'secondaryCluster',
            name: 'Secondary Cluster',
            selector: row => row.secondaryCluster ? row.secondaryCluster.name : '',
            sortable: true,
        },
        {
            id: 'status',
            name: 'Status',
            selector: row => row.status ? row.status.status : '',
            sortable: true,
        },
        {
            id: 'latestVersion',
            name: 'Latest version',
            selector: row => row.latestVersion && row.latestVersion.type ? row.latestVersion.type.type : '',
            sortable: true,
        },
        {
            id: 'latestVersionTotalCosts',
            name: 'Total Costs',
            selector: row => row.latestVersionTotalCosts,
            format: row => <CostsFormat value={row.latestVersionTotalCosts} />,
            sortable: true,
            reorder: true
        },
        {
            id: 'latestVersionTotalEffort',
            name: 'Total Effort',
            selector: row => row.latestVersionTotalEffort,
            format: row => <EffortFormat value={row.latestVersionTotalEffort} />,
            sortable: true,
        },
    ];

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <BreadcrumbTree current="projects" data={data} linkCurrent={false} />
                    {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}
                    <h1>Projects</h1>
                    <DataTable
                        // title="Projects"
                        keyField="number"
                        columns={columns}
                        data={data._embedded.project}
                    />
                </React.Fragment>
            );
        default:
            return <p>Loading projects...</p>;
    }
}