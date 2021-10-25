import React, { useEffect } from 'react';
import { Table } from "react-bootstrap";
import { apiStates, Api, ApiError } from '../../function/Api';
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";

const PartnerTable = ({ organisation }) => {

    const [resultUrl, setResultUrl] = React.useState('list/partner?organisation=' + organisation.id);
    const { state, error, data, load } = Api(resultUrl);

    useEffect(() => {
        setResultUrl('list/partner?organisation=' + organisation.id);
    }, [organisation]);


    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>

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
                                            <td><Link to={`/project/${result.project.identifier}/${result.project.name}`}>{result.project.name}</Link></td>
                                            <td><Link to={`/partner/${result.id}/${result.organisation.name}`}>{result.organisation.name}</Link></td>

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