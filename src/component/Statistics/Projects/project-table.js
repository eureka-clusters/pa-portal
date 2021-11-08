import React, { useState, useEffect } from 'react';
import { apiStates, Api, getFilter, ApiError } from '../../../function/api';
import { Link } from "react-router-dom";
import DataTable from '../../DataTableBase';
import { CostsFormat, EffortFormat } from '../../../function/utils';

const ProjectTable = ({ filter, updateFilter, updateHash, updateResults }) => {

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


    const [resultUrl, setResultUrl] = useState('/statistics/results/project?filter=' + getFilter(filter));
    const { state, error, data } = Api(resultUrl);

    useEffect(() => {
        setResultUrl('/statistics/results/project?filter=' + getFilter(filter));
    }, [filter]);


    switch (state) {
        case apiStates.ERROR:
            return (
                <>
                    <ApiError error={error} />
                    <br /><br />Filter used <code className={'pb-2 text-muted'}>{getFilter(filter)}</code>
                </>
            );
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <pre className='debug'>{JSON.stringify(filter, undefined, 2)}</pre> */}
                    {/* <pre className='debug'>{JSON.stringify(data._embedded.results, undefined, 2)}</pre> */}
                    <h2>Projects</h2>
                    <DataTable
                        title="Projects"
                        keyField="number"
                        columns={columns}
                        data={data._embedded.results}
                    />
                </React.Fragment>
            );
        default:
            return <p>Loading data...</p>;
    }
}

export default ProjectTable;