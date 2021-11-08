import React, { useEffect } from 'react';
import { Table } from "react-bootstrap";
import { apiStates, Api, getFilter, ApiError } from '../../../function/api';
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import DataTable from '../../DataTableBase';
import { CostsFormat, EffortFormat } from '../../../function/utils';


const PartnerTable = ({ filter }) => {

    const hasYearFilter = filter.year.length > 0;

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
            omit: hasYearFilter
        },
        {
            id: 'partner_effort',
            name: 'Partner Effort',
            selector: row => row.latestVersionEffort,
            format: row => <EffortFormat value={row.latestVersionEffort} />,
            sortable: true,
            omit: hasYearFilter
        },
        {
            id: 'year',
            name: 'Year',
            selector: row => row.year,
            sortable: true,
            reorder: true,
            omit: !hasYearFilter
        },
        {
            id: 'partner_costs_in_year',
            name: 'Partner Costs in Year',
            selector: row => row.latestVersionCostsInYear,
            format: row => <CostsFormat value={row.latestVersionCostsInYear} />,
            sortable: true,
            reorder: true,
            omit: !hasYearFilter
        },
        {
            id: 'partner_effort_in_year',
            name: 'Partner Effort in Year',
            selector: row => row.latestVersionEffortInYear,
            format: row => <EffortFormat value={row.latestVersionEffortInYear} />,
            sortable: true,
            omit: !hasYearFilter
        },
    ];


    const [resultUrl, setResultUrl] = React.useState('/statistics/results/partner?filter=' + getFilter(filter));

    const { state, error, data } = Api(resultUrl);
    

    useEffect(() => {
        setResultUrl('/statistics/results/partner?filter=' + getFilter(filter));
    }, [filter]);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <pre className='debug'>{JSON.stringify(filter, undefined, 2)}</pre> */}
                    {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}
                    <DataTable
                        title="Partners"
                        keyField="id"
                        columns={columns}
                        data={data._embedded.results}
                        paginationPerPage={50}  // overwrite the default paginationPerPage setting
                        paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100, 200]}
                    />

                    <h2>Partners</h2>
                    <Table className="caption-top" size={'sm'} striped hover>
                        <caption>
                            List of Partners: <span className="float-end">Displaying {data._embedded.results.length} results.</span>
                        </caption>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Project</th>
                                <th>Partner</th>
                                <th>Country</th>
                                <th>Type</th>
                                {!hasYearFilter && <>
                                    <th className={'text-right'}>Partner Costs</th>
                                    <th className={'text-right'}>Partner Effort</th>
                                </>}
                                {hasYearFilter && <>
                                    <th>Year</th>
                                    <th className={'text-right'}>Partner Costs in year</th>
                                    <th className={'text-right'}>Partner Effort in year</th>
                                </>}
                            </tr>
                        </thead>
                        <tbody>
                            {data._embedded.results.map((result, i) => {
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
                                            {!hasYearFilter && <>
                                                <td className={'text-monospace text-right'}><NumberFormat
                                                    value={result.latestVersionCosts}
                                                    thousandSeparator={' '}
                                                    displayType={'text'}
                                                    prefix={'€ '} /></td>
                                                <td className={'text-monospace text-right'}><NumberFormat
                                                    value={result.latestVersionEffort}
                                                    thousandSeparator={' '}
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                    displayType={'text'}
                                                /></td>
                                            </>
                                            }
                                            {hasYearFilter && <>
                                                <td>{result.year}</td>
                                                <td className={'text-monospace text-right'}><NumberFormat
                                                    value={result.latestVersionCostsInYear}
                                                    thousandSeparator={' '}
                                                    displayType={'text'}
                                                    prefix={'€ '} /></td>
                                                <td className={'text-monospace text-right'}><NumberFormat
                                                    value={result.latestVersionEffortInYear}
                                                    thousandSeparator={' '}
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                    displayType={'text'}
                                                /></td>
                                            </>
                                            }
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