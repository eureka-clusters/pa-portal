import React, { FC, useState, Suspense } from 'react';
import { ApiError, apiStates } from 'function/api/index';
import { Link } from "react-router-dom";
import DataTable from 'component/database-table/index';
import { CostsFormat, EffortFormat } from 'function/utils';
import { Project } from "interface/project";
import { Partner } from "interface/project/partner";
import { GetPartners } from "function/api/get-partners";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

// import TestPages from './test';
// import OrganisationTypeChart from 'component/project/charts/organisation-type-chart';
// import OrganisationCountryChart from 'component/project/charts/country-chart';
// import BudgetByOrganisationTypeChart from 'component/project/charts/budget-by-organisation-type-chart';
// import BudgetByCountryChart from 'component/project/charts/budget-and-effort-by-country-chart';

// try lazy loading
const OrganisationTypeChart = React.lazy(() => import('component/project/charts/organisation-type-chart'));
const OrganisationCountryChart = React.lazy(() => import('component/project/charts/country-chart'));
const BudgetByOrganisationTypeChart = React.lazy(() => import('component/project/charts/budget-by-organisation-type-chart'));
const BudgetByCountryChart = React.lazy(() => import('component/project/charts/budget-and-effort-by-country-chart'));

interface Props {
    project: Project
}

const PartnerTable: FC<Props> = ({ project }) => {

    const [activeTab, setActiveTab] = useState('table'); // default tab


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
            format: (partner: Partner) => <CostsFormat value={partner.latestVersionCosts} />,
            sortable: true,
            reorder: true,
        },
        {
            id: 'partner_effort',
            name: 'Partner Effort',
            selector: (partner: Partner) => partner.latestVersionEffort,
            format: (partner: Partner) => <EffortFormat value={partner.latestVersionEffort} />,
            sortable: true,
        },
    ];


    const { state, error, partners } = GetPartners(project);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}
                    <h2>Partners</h2>

                    {/* <DataTable
                        // title="Partners"
                        keyField="id"
                        columns={columns}
                        data={data._embedded.partner}
                        pagination={false}
                    /> */}
                    {/* <TestPages /> */}

                    <Tabs 
                        
                        id="partner-tabs"
                        className="mb-3"
                        // defaultActiveKey="table"
                        activeKey={activeTab}
                        // use a state Controlled tab and window.dispatchEvent so that the charts are correctly resized (which is not the case when the tab is hidden)
                        onSelect={(k) => {
                            if (k) {
                                setActiveTab(k);
                                // trigger windows resize so that the chart is re-drawn 
                                if (k === 'charts') {
                                    // console.log('trigger resize');
                                    window.dispatchEvent(new Event('resize'));
                                }
                            }
                        }}
                    >
                        <Tab eventKey="table" title="Table">
                            <DataTable
                                // title="Partners"
                                keyField="id"
                                columns={columns}
                                data={partners}
                                pagination={false}
                            />
                        </Tab>
                        <Tab eventKey="charts" title="Charts">
                            <Suspense fallback={<div>Loading...</div>}>
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <OrganisationTypeChart results={partners} />
                                    </div>
                                    <div className="col">
                                        <OrganisationCountryChart results={partners} />
                                    </div>
                                </div>
                                <div className="row">
                                        <BudgetByOrganisationTypeChart results={partners} />
                                </div>
                                <div className="row">
                                        <BudgetByCountryChart results={partners} />
                                </div>
                            </div>
                            </Suspense>
                        </Tab>
                        
                    </Tabs>
                </React.Fragment>
            );
        default:
            return <p>Loading data...</p>;
    }
}

export default PartnerTable;