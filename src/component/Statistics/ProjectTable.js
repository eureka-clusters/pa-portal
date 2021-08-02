import React from 'react';
import { Table } from "react-bootstrap";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";

const ProjectTable = ({ results }) => {
    return (
        <React.Fragment>
            <h2>Projects</h2>
            <Table size={'sm'} striped hover>
                <thead>
                    <tr>
                        <th></th>
                        <th>Number</th>
                        <th>Name</th>
                        <th>Primary Cluster</th>
                        <th>Secondary Cluster</th>
                        <th>Status</th>
                        <th>Latest version</th>
                        <th className={'text-right'}>Total Costs</th>
                        <th className={'text-right'}>Total Effort</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr><td colSpan={9} /></tr>
                </tfoot>
                <tbody>
                    {results.map((result, i) => {
                        return <React.Fragment key={i}>
                            <tr>
                                <td><small className={'text-muted'}>{result.id}</small></td>
                                <td>{result.projectNumber}</td>
                                <td><Link to={`/project/${result.identifier}/${result.projectName}`}>{result.projectName}</Link></td>
                                <td>{result.primaryCluster}</td>
                                <td>{result.secondaryCluster}</td>
                                <td>{result.projectStatus}</td>
                                <td>{result.latestVersionType}</td>
                                <td className={'text-monospace text-right'}><NumberFormat
                                    value={result.latestVersionTotalCosts}
                                    thousandSeparator={' '}
                                    displayType={'text'}
                                    prefix={'€ '} /></td>
                                <td className={'text-monospace text-right'}><NumberFormat
                                    value={result.latestVersionTotalEffort}
                                    thousandSeparator={' '}
                                    displayType={'text'}
                                /></td>
                            </tr>
                        </React.Fragment>
                    })
                    }
                </tbody>
            </Table>            
        </React.Fragment>
    );
}

export default ProjectTable;