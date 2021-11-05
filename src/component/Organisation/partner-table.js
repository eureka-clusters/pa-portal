import React, { useEffect, useState } from 'react';
import { Table } from "react-bootstrap";
import { apiStates, Api, ApiError } from '../../function/Api';
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import DataTable from '../DataTableBase';
import { CostsFormat, EffortFormat } from '../../function/utils';

const PartnerTable = ({ organisation }) => {


    const columns = [
        {
            id: 'id',
            name: 'Id',
            selector: row => row.id,
            sortable: true,
        },
        {
            id: 'project',
            name: 'Project',
            selector: row => row.project.name,
            format: row => <Link to={`/project/${row.project.slug}`} title={row.project.name} >{row.project.name}</Link>,
            sortable: true,
            omit: true,
        },
        {
            id: 'partner',
            name: 'Partner',
            selector: row => row.organisation.name,
            format: row => <Link to={`/partner/${row.slug}`} title={row.organisation.name} >{row.organisation.name}</Link>,
            sortable: true,
        },
        {
            id: 'country',
            name: 'Country',
            selector: row => row.organisation && row.organisation.country ? row.organisation.country.country : '',
            sortable: true,
        },
        {
            id: 'type',
            name: 'Type',
            selector: row => row.organisation && row.organisation.type ? row.organisation.type.type : '',
            sortable: true,
        },

        {
            id: 'partner_costs',
            name: 'Partner Costs',
            selector: row => row.latestVersionCosts,
            format: row => <CostsFormat value={row.latestVersionCosts} />,
            sortable: true,
            reorder: true,
        },
        {
            id: 'partner_effort',
            name: 'Partner Effort',
            selector: row => row.latestVersionEffort,
            format: row => <EffortFormat value={row.latestVersionEffort} />,
            sortable: true,
        },
    ];


    const [resultUrl, setResultUrl] = useState('list/partner?organisation=' + organisation.slug);
    const { state, error, data } = Api(resultUrl);

    useEffect(() => {
        setResultUrl('list/partner?organisation=' + organisation.slug);
    }, [organisation]);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}
                    <DataTable
                        title="Partners"
                        keyField="id"
                        columns={columns}
                        data={data._embedded.partner}
                        pagination={false}
                    />
                    <h2>Partners</h2>
                    <Table size={'sm'} striped hover>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Project</th>
                                <th>Partner</th>
                                <th>Country</th>
                                <th>Type</th>
                                <th className={'text-right'}>Partner Costs</th>
                                <th className={'text-right'}>Partner Effort</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data._embedded.partner.map((result, i) => {
                                return (
                                    <React.Fragment key={i}>
                                        <tr className={!result.isActive ? 'table-danger' : null}>
                                            <td><small className={'text-muted'}>{result.id}</small></td>
                                            {/* <td><Link to={`/project/${result.projectName}`}>{result.projectName}</Link></td> */}
                                            <td><Link to={`/project/${result.project.slug}`}>{result.project.name}</Link></td>
                                            <td><Link to={`/partner/${result.slug}`}>{result.organisation.name}</Link></td>

                                            {/* <td><Link to={`/partner/${result.id}`}>{result.partner}</Link></td> */}
                                            <td>{result.organisation.country.country}</td>
                                            <td>{result.organisation.type.type}</td>
                                            <td className={'text-monospace text-right'}><NumberFormat
                                                value={result.latestVersionCosts}
                                                thousandSeparator={' '}
                                                displayType={'text'}
                                                prefix={'€ '} /></td>
                                            <td className={'text-monospace text-right'}><NumberFormat
                                                value={result.latestVersionEffort}
                                                thousandSeparator={' '}
                                                displayType={'text'}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                            /></td>

                                        </tr>
                                    </React.Fragment>)
                            })
                            }
                        </tbody>
                    </Table>
                </React.Fragment>
            );
        default:
            return <p>Loading data...</p>;
    }
}

export default PartnerTable;