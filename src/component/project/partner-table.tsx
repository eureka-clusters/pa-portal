import React, {FC} from 'react';
import {Link} from "react-router-dom";
import DataTable from 'component/database-table/index';
import { CostsFormat, EffortFormat, BooleanIconFormat } from 'function/utils';
import {Partner} from "interface/project/partner";

interface Props {
    results: Array<Partner>
}

const PartnerTable: FC<Props> = ({results}) => {

    const columns = [
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
            format: (partner: Partner) => <CostsFormat value={partner.latestVersionCosts} />,
            sortable: true,
            // reorder: true,
        },
        {
            id: 'partner_effort',
            name: 'Partner Effort',
            selector: (partner: Partner) => partner.latestVersionEffort,
            format: (partner: Partner) => <EffortFormat value={partner.latestVersionEffort} />,
            sortable: true,
        },
        {
            id: 'partner_isActive',
            name: 'isActive',
            selector: (partner: Partner) => partner.isActive,
            format: (partner: Partner) => <BooleanIconFormat value={partner.isActive}/>,
            sortable: true,
        },
        {
            id: 'partner_isSelfFunded',
            name: 'isSelfFunded',
            selector: (partner: Partner) => partner.isSelfFunded,
            // format: (partner: Partner) => <BooleanIconFormat value={partner.isSelfFunded} type="square" showFalse={true} />,
            format: (partner: Partner) => <BooleanIconFormat value={partner.isSelfFunded} />,
            sortable: true,
        },
        {
            id: 'partner_isCoordinator',
            name: 'isCoordinator',
            selector: (partner: Partner) => partner.isCoordinator,
            format: (partner: Partner) => <BooleanIconFormat value={partner.isCoordinator} />,
            sortable: true,
        },
    ];

    return (
        <React.Fragment>
            {/* <pre className='debug'>{JSON.stringify(results, undefined, 2)}</pre> */}
            <DataTable
                // title="Partners"
                keyField="id"
                columns={columns}
                data={results}
                pagination={false}
            />
        </React.Fragment>
    );
}

export default PartnerTable;