import React, {FC} from 'react';
import {Table} from "react-bootstrap";
import {ApiError, apiStates, getFilter} from '../../../function/api';
import NumberFormat from "react-number-format";
import {Link} from "react-router-dom";
import DataTable from '../../DataTableBase';
import {CostsFormat, EffortFormat} from '../../../function/utils';
import {Partner} from "../../../interface/project/partner";
import {GetResults} from "../../../function/api/statistics/partner/get-results";


interface Props {
    filter: any
}

const PartnerTable: FC<Props> = ({filter}) => {

    const hasYearFilter = filter.year.length > 0;

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
            omit: hasYearFilter
        },
        {
            id: 'partner_effort',
            name: 'Partner Effort',
            selector: (partner: Partner) => partner.latestVersionEffort,
            format: (partner: Partner) => <EffortFormat value={partner.latestVersionEffort}/>,
            sortable: true,
            omit: hasYearFilter
        },
        {
            id: 'year',
            name: 'Year',
            selector: (partner: Partner) => partner.year,
            sortable: true,
            reorder: true,
            omit: !hasYearFilter
        },
        {
            id: 'partner_costs_in_year',
            name: 'Partner Costs in Year',
            selector: (partner: Partner) => partner.latestVersionCostsInYear,
            format: (partner: Partner) => <CostsFormat value={partner.latestVersionCostsInYear}/>,
            sortable: true,
            reorder: true,
            omit: !hasYearFilter
        },
        {
            id: 'partner_effort_in_year',
            name: 'Partner Effort in Year',
            selector: (partner: Partner) => partner.latestVersionEffortInYear,
            format: (partner: Partner) => <EffortFormat value={partner.latestVersionEffortInYear}/>,
            sortable: true,
            omit: !hasYearFilter
        },
    ];


    const {state, error, partners} = GetResults(getFilter(filter));


    // useEffect(() => {
    //     setPartnerUrl('/statistics/partners/partner?filter=' + getFilter(filter));
    // }, [filter]);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error}/>
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <pre className='debug'>{JSON.stringify(filter, undefined, 2)}</pre> */}
                    {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}
                    <DataTable
                        title="Partners"
                        keyField="id"
                        columns={columns}
                        data={partners}
                        paginationPerPage={50}  // overwrite the default paginationPerPage setting
                        paginationPartnersPerPageOptions={[10, 15, 20, 25, 30, 50, 100, 200]}
                    />

                    <h2>Partners</h2>
                    <Table className="caption-top" size={'sm'} striped hover>
                        <caption>
                            List of Partners: <span className="float-end">Displaying {partners.length} partners.</span>
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
                        {partners.map((partner, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <tr className={!partner.isActive ? 'table-danger' : ''}>
                                        <td><small className={'text-muted'}>{partner.id}</small></td>
                                        {/* <td><Link to={`/project/${partner.projectName}`}>{partner.projectName}</Link></td> */}
                                        <td><Link to={`/project/${partner.project.slug}`}>{partner.project.name}</Link>
                                        </td>


                                        <td><Link to={`/partner/${partner.slug}`}>{partner.organisation.name}</Link>
                                        </td>

                                        {/* <td><Link to={`/partner/${partner.id}`}>{partner.partner}</Link></td> */}
                                        <td>{partner.organisation.country.country}</td>
                                        <td>{partner.organisation.type.type}</td>
                                        {!hasYearFilter && <>
                                            <td className={'text-monospace text-right'}><NumberFormat
                                                value={partner.latestVersionCosts}
                                                thousandSeparator={' '}
                                                displayType={'text'}
                                                prefix={'€ '}/></td>
                                            <td className={'text-monospace text-right'}><NumberFormat
                                                value={partner.latestVersionEffort}
                                                thousandSeparator={' '}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                displayType={'text'}
                                            /></td>
                                        </>
                                        }
                                        {hasYearFilter && <>
                                            <td>{partner.year}</td>
                                            <td className={'text-monospace text-right'}><NumberFormat
                                                value={partner.latestVersionCostsInYear}
                                                thousandSeparator={' '}
                                                displayType={'text'}
                                                prefix={'€ '}/></td>
                                            <td className={'text-monospace text-right'}><NumberFormat
                                                value={partner.latestVersionEffortInYear}
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