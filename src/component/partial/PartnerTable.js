import React from 'react';
import { Table } from "react-bootstrap";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";

const PartnerTable = ({ results, filter }) => {

    const hasYearFilter = filter.year.length > 0;   

    return (
        <React.Fragment>
            <h2>Partners</h2>
            <Table size={'sm'} striped hover>
                <thead>
                    <tr>
                        <th></th>
                        <th>Number</th>
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
                    {results.map((result, i) => {
                        return (
                            <React.Fragment key={i}>
                                <tr className={!result.active ? 'table-danger': null}>
                                    <td><small className={'text-muted'}>{result.id}</small></td>
                                    <td>{result.projectNumber}</td>
                                    <td><Link to={`/project/${result.projectName}`}>{result.projectName}</Link></td>
                                    <td><Link to={`/partner/${result.id}`}>{result.partner}</Link></td>
                                    <td>{result.country}</td>
                                    <td>{result.partnerType}</td>
                                    {!hasYearFilter && <>
                                        <td className={'text-monospace text-right'}><NumberFormat
                                            value={result.latestVersionCosts}
                                            thousandSeparator={' '}
                                            displayType={'text'}
                                            prefix={'€ '} /></td>
                                        <td className={'text-monospace text-right'}><NumberFormat
                                            value={result.latestVersionEffort}
                                            thousandSeparator={' '}
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
}

export default PartnerTable;