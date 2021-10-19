import React, { useEffect } from 'react';
import { Table } from "react-bootstrap";
import { apiStates, Api, getFilter} from '../../../function/Api';
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";

const PartnerTable = ({ filter }) => {

    const [resultUrl, setResultUrl] = React.useState('/statistics/results/partner?filter=' + getFilter(filter));

    const { state, error, data, load } = Api(resultUrl);
    const hasYearFilter = filter.year.length > 0;

    useEffect(() => {
        setResultUrl('/statistics/results/partner?filter=' + getFilter(filter));
    }, [filter]);

    switch (state) {
        case apiStates.ERROR:
            return <p>ERROR: {error || 'General error'}</p>;
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <pre>{JSON.stringify(filter)}</pre>
                    <h2>Partners</h2>
                    <Table size={'sm'} striped hover>
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
                                            <td><Link to={`/project/${result.project.identifier}/${result.project.name}`}>{result.project.name}</Link></td>


                                            <td><Link to={`/partner/${result.id}/${result.organisation.name}`}>{result.organisation.name}</Link></td>

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

                    <code className={'pb-2 text-muted'}>{btoa(JSON.stringify(filter))}</code>
                    <br></br>
                </React.Fragment>
            );
        default:
            return <p>Loading data...</p>;
    }
}

export default PartnerTable;