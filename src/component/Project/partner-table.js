import React, { useEffect, useState } from 'react';
import { apiStates, Api, ApiError } from '../../function/Api';
import { Link } from "react-router-dom";
import DataTable from 'component/DataTableBase';
import { CostsFormat, EffortFormat } from 'function/utils';
import OrganisationTypeChart from './charts/organisation-type-chart';
import OrganisationCountryChart from './charts/country-chart';
import BudgetByOrganisationTypeChart from './charts/budget-by-organisation-type-chart';
import BudgetByCountryChart from './charts/budget-and-effort-by-country-chart';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TestPages from './test';

const PartnerTable = ({ project }) => {

    const [activeTab, setActiveTab] = useState('table'); // default tab


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

                    {/* <DataTable
                        // title="Partners"
                        keyField="id"
                        columns={columns}
                        data={data._embedded.partner}
                        pagination={false}
                    /> */}
                    <TestPages />

                    <Tabs 
                        
                        id="partner-tabs"
                        className="mb-3"
                        // defaultActiveKey="table"
                        activeKey={activeTab}
                        // use a state Controlled tab and window.dispatchEvent so that the charts are correctly resized (which is not the case when the tab is hidden)
                        onSelect={(k) => {
                            setActiveTab(k);
                            // trigger windows resize so that the chart is re-drawn 
                            if (k === 'charts') {
                                console.log('trigger resize');
                                window.dispatchEvent(new Event('resize'));
                            }
                        }}
                    >
                        <Tab eventKey="table" title="Table">
                            <DataTable
                                // title="Partners"
                                keyField="id"
                                columns={columns}
                                data={data._embedded.partner}
                                pagination={false}
                            />
                        </Tab>
                        <Tab eventKey="charts" title="Charts">
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <OrganisationTypeChart results={data._embedded.partner} />
                                    </div>
                                    <div className="col">
                                        <OrganisationCountryChart results={data._embedded.partner} />
                                    </div>
                                </div>
                                <div className="row">
                                    <BudgetByOrganisationTypeChart results={data._embedded.partner} />
                                </div>
                                <div className="row">
                                    <BudgetByCountryChart results={data._embedded.partner} />
                                </div>
                            </div>
                        </Tab>
                        
                    </Tabs>

                    {/* <div className="container">
                        <div className="row">
                            <div className="col">
                                <OrganisationTypeChart results={data._embedded.partner} />
                            </div>
                            <div className="col">
                                <OrganisationCountryChart results={data._embedded.partner} />
                            </div>
                        </div>
                        <div className="row">
                            <BudgetByOrganisationTypeChart results={data._embedded.partner} />
                        </div>
                        <div className="row">
                            <BudgetByCountryChart results={data._embedded.partner} />
                        </div>
                    </div> */}


                </React.Fragment>
            );
        default:
            return <p>Loading data...</p>;
    }
}

export default PartnerTable;