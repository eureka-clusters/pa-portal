import React, {FC} from 'react';
import {Link} from "react-router-dom";
import DataTable from 'component/database-table/index';
import {CostsFormat, EffortFormat} from 'function/utils';
import {Partner} from "interface/project/partner";
import {Organisation} from "interface/organisation";
import { usePartners, apiStates, ApiError } from 'hooks/api/partner/usePartners';
interface Props {
    organisation: Organisation
}

const PartnerTable: FC<Props> = ({organisation}) => {

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

    const { 
        state,
        error,
        partners,
        /*load, pageCount, pageSize, page, totalItems*/ 
    } = usePartners({ organisation: organisation.slug });

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error}/>
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <h2>Partners</h2>
                    <DataTable
                        keyField="id"
                        columns={columns}
                        data={partners}
                        pagination={false}
                    />
                </React.Fragment>
            );
        default:
            return <p>Loading data...</p>;
    }
}

export default PartnerTable;