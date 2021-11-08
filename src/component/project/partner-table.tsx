import React, {FC} from 'react';
import {Table} from "react-bootstrap";
import {ApiError, apiStates} from '../../function/api';
import NumberFormat from "react-number-format";
import {Link} from "react-router-dom";
import DataTable from '../DataTableBase';
import {CostsFormat, EffortFormat} from '../../function/utils';
import {Project} from "../../interface/project";
import {Partner} from "../../interface/project/partner";
import GetPartners from "../../function/api/get-partners";

interface Props {
    project: Project
}

const PartnerTable: FC<Props> = ({project}) => {

    const columns = [
        {
            id: 'id',
            name: 'Id',
            selector: (partner: Partner) => partner.id,
            sortable: true,
        },
        {
            id: 'project',
            name: 'Project',
            selector: (partner: Partner) => partner.project.name,
            format: (partner: Partner) => <Link to={`/project/${partner.project.slug}`}
                                                title={partner.project.name}>{partner.project.name}</Link>,
            sortable: true,
            omit: true,
        },
        {
            id: 'partner',
            name: 'Partner',
            selector: (partner: Partner) => partner.organisation.name,
            format: (partner: Partner) => <Link to={`/partner/${partner.slug}`}
                                                title={partner.organisation.name}>{partner.organisation.name}</Link>,
            sortable: true,
        },
        {
            id: 'country',
            name: 'Country',
            selector: (partner: Partner) => partner.organisation && partner.organisation.country ? partner.organisation.country.country : '',
            sortable: true,
        },
        {
            id: 'type',
            name: 'Type',
            selector: (partner: Partner) => partner.organisation && partner.organisation.type ? partner.organisation.type.type : '',
            sortable: true,
        },

        {
            id: 'partner_costs',
            name: 'Partner Costs',
            selector: (partner: Partner) => partner.latestVersionCosts,
            format: (partner: Partner) => <CostsFormat value={partner.latestVersionCosts}/>,
            sortable: true,
            reorder: true,
        },
        {
            id: 'partner_effort',
            name: 'Partner Effort',
            selector: (partner: Partner) => partner.latestVersionEffort,
            format: (partner: Partner) => <EffortFormat value={partner.latestVersionEffort}/>,
            sortable: true,
        },
    ];

    // const [resultUrl, setResultUrl] = React.useState('list/partner?project=' + project.slug);
    const {state, error, partners} = GetPartners(project);

    // useEffect(() => {
    //     setResultUrl('list/partner?project=' + project.slug);
    // }, [project]);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error}/>
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}
                    <DataTable
                        title="Partners"
                        keyField="id"
                        columns={columns}
                        data={partners}
                        pagination={false}
                    />

                    <h2>Partners</h2>
                    <Table size={'sm'} striped hover>
                        <thead>
                        <tr>
                            <th></th>
                            <th>Partner</th>
                            <th>Country</th>
                            <th>Type</th>
                            <th className={'text-right'}>Partner Costs</th>
                            <th className={'text-right'}>Partner Effort</th>
                        </tr>
                        </thead>
                        <tbody>
                        {partners.map((result, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <tr className={!result.isActive ? 'table-danger' : ''}>
                                        <td><small className={'text-muted'}>{result.id}</small></td>
                                        <td><Link to={`/partner/${result.slug}`}>{result.organisation.name}</Link></td>

                                        {/* <td><Link to={`/partner/${result.id}`}>{result.partner}</Link></td> */}
                                        <td>{result.organisation.country.country}</td>
                                        <td>{result.organisation.type.type}</td>
                                        <td className={'text-monospace text-right'}><NumberFormat
                                            value={result.latestVersionCosts}
                                            thousandSeparator={' '}
                                            displayType={'text'}
                                            prefix={'€ '}/></td>
                                        <td className={'text-monospace text-right'}>
                                            <NumberFormat
                                                value={result.latestVersionEffort}
                                                thousandSeparator={' '}
                                                displayType={'text'}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                            />
                                        </td>

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