import React, { FC, useState, Suspense } from 'react';
import { Project } from "interface/project";
import { usePartners, apiStates, ApiError } from 'hooks/api/partner/usePartners';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import PartnerTable from './partner-table';
import OrganisationTypeChart from 'component/project/charts/organisation-type-chart';
import OrganisationCountryChart from 'component/project/charts/country-chart';
import BudgetByOrganisationTypeChart from 'component/project/charts/budget-by-organisation-type-chart';
import BudgetByCountryChart from 'component/project/charts/budget-and-effort-by-country-chart';

// try lazy loading
// const OrganisationTypeChart = React.lazy(() => import('component/project/charts/organisation-type-chart'));
// const OrganisationCountryChart = React.lazy(() => import('component/project/charts/country-chart'));
// const BudgetByOrganisationTypeChart = React.lazy(() => import('component/project/charts/budget-by-organisation-type-chart'));
// const BudgetByCountryChart = React.lazy(() => import('component/project/charts/budget-and-effort-by-country-chart'));

interface Props {
    project: Project
}

const PartnerTableWithCharts: FC<Props> = ({ project }) => {

    const [activeTab, setActiveTab] = useState('table'); // default tab

    const {
        state,
        error,
        partners,
        // load, 
        // pageCount, 
        // pageSize, 
        // page, 
        // totalItems
    } = usePartners({ project: project.slug });


    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <h2>Partners</h2>

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
                            <PartnerTable results={partners} />
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

export default PartnerTableWithCharts;