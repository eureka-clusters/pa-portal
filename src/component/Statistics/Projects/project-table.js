import React, { useState, useEffect } from 'react';
import { Table } from "react-bootstrap";
import { apiStates, Api } from '../../../function/Api';
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";

const ProjectTable = ({ filter, updateFilter, updateHash, updateResults }) => {

    const [resultUrl, setResultUrl] = useState('/statistics/results/project?filter=' + btoa(JSON.stringify(filter)));
    const { state, error, data, load } = Api(resultUrl);

    useEffect(() => {
        setResultUrl('/statistics/results/project?filter=' + btoa(JSON.stringify(filter)));
    }, [filter]);

    switch (state) {
        case apiStates.ERROR:
            return <p>ERROR: {error || 'General error'} <br /><br />Filter used <code className={'pb-2 text-muted'}>{btoa(JSON.stringify(filter))}</code></p>;
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <div>{JSON.stringify(filter)}</div>
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
                            {data._embedded.results.map((result, i) => {
                                return <React.Fragment key={i}>
                                    <tr>
                                        <td><small className={'text-muted'}>{result.id}</small></td>
                                        <td>{result.number}</td>
                                        <td><Link to={`/project/${result.identifier}/${result.name}`}>{result.name}</Link></td>
                                        <td>{result.primaryCluster}</td>
                                        <td>{result.secondaryCluster}</td>
                                        <td>{result.status}</td>
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

                    <code className={'pb-2 text-muted'}>{btoa(JSON.stringify(filter))}</code>
                    <br></br>
                </React.Fragment>
            );
        default:
            return <p>Loading data...</p>;
    }
}

export default ProjectTable;