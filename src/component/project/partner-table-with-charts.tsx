import React, {FC, Suspense, useContext, useState} from 'react';
import {Project} from "@/interface/project";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import PartnerTable from './partner-table';
import OrganisationTypeChart from '@/component/project/charts/organisation-type-chart';
import OrganisationCountryChart from '@/component/project/charts/country-chart';
import BudgetByOrganisationTypeChart from '@/component/project/charts/budget-by-organisation-type-chart';
import BudgetByCountryChart from '@/component/project/charts/budget-and-effort-by-country-chart';
import {getPartners} from "@/hooks/partner/get-partners";
import {useGetFilterOptions} from '@/functions/filter-functions';
import {useQuery} from "@tanstack/react-query";
import {AxiosContext} from "@/providers/axios-provider";
import {Partner} from "@/interface/project/partner";
import {Version} from "@/interface/project/version";

interface Props {
    project: Project
    activeVersion?: Version
}

const PartnerTableWithCharts: FC<Props> = ({project, activeVersion}) => {

    const [activeTab, setActiveTab] = useState('table'); // default tab
    const filterOptions = useGetFilterOptions();
    const authAxios = useContext(AxiosContext).authAxios;

    const {isLoading, data} = useQuery({
        queryKey: ['projectPartners', filterOptions, project, activeVersion],
        queryFn: () => getPartners({
            authAxios, filterOptions, project, activeVersion, paginationOptions: {
                pageIndex: 0,
                pageSize: 1000,
            }
        })
    });

    if (isLoading) {
        return <div>Loading...</div>
    }

    const partners: Partner[] = data!.partners

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
                            window.dispatchEvent(new Event('resize'));
                        }
                    }
                }}
            >
                <Tab eventKey="table" title="Table">
                    <PartnerTable project={project} activeVersion={activeVersion}/>
                </Tab>
                <Tab eventKey="charts" title="Charts">

                    <p>The data in these charts is taken from the latest version</p>

                    <Suspense fallback={<div>Loading...</div>}>
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <OrganisationTypeChart results={partners}/>
                                </div>
                                <div className="col">
                                    <OrganisationCountryChart results={partners}/>
                                </div>
                            </div>
                            <div className="row">
                                <BudgetByOrganisationTypeChart results={partners}/>
                            </div>
                            <div className="row">
                                <BudgetByCountryChart results={partners}/>
                            </div>
                        </div>
                    </Suspense>
                </Tab>

            </Tabs>
        </React.Fragment>
    );
}

export default PartnerTableWithCharts;