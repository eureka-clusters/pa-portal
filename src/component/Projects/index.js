import React from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiStates, Api, ApiError } from '../../function/Api';
import BreadcrumbTree from '../partial/BreadcrumbTree'
import './projects.scss';

export default function Projects(props) {

    const { state, error, data } = Api('/list/project');

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <BreadcrumbTree current="projects" data={data} linkCurrent={false} />
                    {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}
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
                            {data._embedded.project.map((project) => (
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