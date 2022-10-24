import React, {FC} from 'react';
import {Link} from "react-router-dom";
import DataTable from 'component/database-table';
import { CostsFormat, EffortFormat, BooleanIconFormat } from 'function/utils';
import {Partner} from "interface/project/partner";

interface Props {
    results: Array<Partner>
}

const PartnerTable: FC<Props> = ({results}) => {

    const customLatestVersionCostsSort = (rowA: { latestVersionCosts: string; }, rowB: { latestVersionCosts: string; }) => {
        
        const a = parseFloat(rowA.latestVersionCosts.replace(/,/g, ''));
        const b = parseFloat(rowB.latestVersionCosts.replace(/,/g, ''));

        // console.log(['a', rowA.latestVersionCosts, a]);
        // console.log(['b', rowB.latestVersionCosts, b]);

        if (a > b) {
            return 1;
        }

        if (b > a) {
            return -1;
        }

        return 0;
    };

    const customLatestVersionEffortSort = (rowA: { latestVersionEffort: string; }, rowB: { latestVersionEffort: string; }) => {

        const a = parseFloat(rowA.latestVersionEffort.replace(/,/g, ''));
        const b = parseFloat(rowB.latestVersionEffort.replace(/,/g, ''));

        // console.log(['a', rowA.latestVersionEffort, a]);
        // console.log(['b', rowB.latestVersionEffort, b]);

        if (a > b) {
            return 1;
        }

        if (b > a) {
            return -1;
        }

        return 0;
    };

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
            grow: 4,
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
            name: 'Partner Costs (€)',
            selector: (partner: Partner) => partner.latestVersionCosts,
            format: (partner: Partner) => <CostsFormat value={partner.latestVersionCosts} showSuffix={false} showPrefix={false}/>,
            sortable: true,
            right: true,
            sortFunction: customLatestVersionCostsSort, // required if number_format(value, 2) is used in backend
            // reorder: true,
        },
        {
            id: 'partner_effort',
            name: 'Partner Effort (PY)',
            selector: (partner: Partner) => partner.latestVersionEffort,
            format: (partner: Partner) => <EffortFormat value={partner.latestVersionEffort} showSuffix={false} showPrefix={false}/>,
            sortable: true,
            right: true,
            sortFunction: customLatestVersionEffortSort, // required if number_format(value, 2) is used in backend
        },
        {
            id: 'partner_isActive',
            name: 'isActive',
            selector: (partner: Partner) => partner.isActive,
            format: (partner: Partner) => <BooleanIconFormat value={partner.isActive}/>,
            sortable: true,
            center: true,
        },
        {
            id: 'partner_isSelfFunded',
            name: 'isSelfFunded',
            selector: (partner: Partner) => partner.isSelfFunded,
            // format: (partner: Partner) => <BooleanIconFormat value={partner.isSelfFunded} type="square" showFalse={true} />,
            format: (partner: Partner) => <BooleanIconFormat value={partner.isSelfFunded} />,
            sortable: true,
            center: true,
        },
        {
            id: 'partner_isCoordinator',
            name: 'isCoordinator',
            selector: (partner: Partner) => partner.isCoordinator,
            format: (partner: Partner) => <BooleanIconFormat value={partner.isCoordinator} />,
            sortable: true,
            center: true,
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