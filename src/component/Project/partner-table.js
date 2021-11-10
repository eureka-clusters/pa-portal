import React, { useEffect } from 'react';
import { apiStates, Api, ApiError } from '../../function/Api';
import { Link } from "react-router-dom";
import DataTable from '../DataTableBase';
import { CostsFormat, EffortFormat } from '../../function/utils';
import OrganisationTypeChart from './charts/organisation-type-chart';
import OrganisationCountryChart from './charts/country-chart';
import BudgetByOrganisationTypeChart from './charts/budget-by-organisation-type-chart';


const PartnerTable = ({ project }) => {

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

    const [resultUrl, setResultUrl] = React.useState('list/partner?project=' + project.slug);
    const { state, error, data } = Api(resultUrl);

    useEffect(() => {
        setResultUrl('list/partner?project=' + project.slug);
    }, [project]);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}
                    <h2>Partners</h2>
                    <DataTable
                        // title="Partners"
                        keyField="id"
                        columns={columns}
                        data={data._embedded.partner}
                        pagination={false}
                    />

                    <OrganisationTypeChart results={data._embedded.partner} />
                    <OrganisationCountryChart results={data._embedded.partner} />
                    <BudgetByOrganisationTypeChart results={data._embedded.partner} />
                    
                </React.Fragment>
            );
        default:
            return <p>Loading data...</p>;
    }
}

export default PartnerTable;