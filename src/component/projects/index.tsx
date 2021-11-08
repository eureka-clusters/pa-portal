import React from 'react';
import {Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import BreadcrumbTree from '../partial/BreadcrumbTree'
import './projects.scss';
import DataTable from '../DataTableBase';
import {Project} from "../../interface/project";
import {CostsFormat, EffortFormat} from '../../function/utils';
import {ApiError, apiStates, GetProjects} from "../../function/api/get-projects";

export default function Projects() {

    const {state, error, projects} = GetProjects();

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
                    <BreadcrumbTree current="projects" data={projects} linkCurrent={false}/>
                    {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}
                    <DataTable
                        title="Projects"
                        keyField="number"
                        columns={columns}
                        data={projects}
                    />
                    <h1>Projects</h1>
                    <Table size="sm" striped>
                        <thead>
                        <tr>
                            <th>Number</th>
                            <th>Name</th>
                            <th>Title</th>
                            <td>Primary cluster</td>
                            <td>Secondary cluster</td>
                        </tr>
                        </thead>
                        <tbody>
                        {projects.map((project) => (
                            <tr>
                                <td>{project.number} </td>
                                <td><Link to={`/project/${project.slug}`}>{project.name}</Link></td>
                                <td>{project.title}</td>
                                <td>{project.primaryCluster && project.primaryCluster.name}</td>
                                <td>{project.secondaryCluster && project.secondaryCluster.name}</td>
                            </tr>
                        ))}

                        </tbody>
                    </Table>
                </React.Fragment>
            );
        default:
            return <p>Loading projects...</p>;
    }
}