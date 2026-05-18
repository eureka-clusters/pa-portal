import React, {FC, lazy, Suspense, useState} from 'react';
import {Project} from "@/interface/project";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import PartnerTable from './partner-table';
import {getPartners} from "@/hooks/partner/get-partners";
import {useGetFilterOptions} from '@/functions/filter-functions';
import {useQuery} from "@tanstack/react-query";
import {QueryState} from "@/component/partial/query-state";
import {useAxios} from "@/providers/axios-provider";

const PartnerCharts = lazy(() => import("@/component/project/partner-charts"));

interface Props {
    project: Project
}

const PartnerTableWithCharts: FC<Props> = ({project}) => {

    const [activeTab, setActiveTab] = useState('table'); // default tab
    const filterOptions = useGetFilterOptions();
    const {authAxios} = useAxios();

    const {isLoading, isError, data} = useQuery({
        queryKey: ['projectPartners', filterOptions, project],
        queryFn: () => getPartners({
            authAxios, filterOptions, project, paginationOptions: {
                pageIndex: 0,
                pageSize: 1000,
            }
        })
    });

    if (isLoading || isError) {
        return (
            <QueryState
                isLoading={isLoading}
                isError={isError}
                errorMessage="The project partners could not be loaded."
            />
        );
    }

    if (!data) {
        return <div>No partner data is available.</div>;
    }

    return (
        <>
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
                    <PartnerTable project={project}/>
                </Tab>
                <Tab eventKey="charts" title="Charts">

                    <p>The data in these charts is taken from the latest version</p>

                    {activeTab === "charts" ? (
                        <Suspense fallback={<QueryState isLoading isError={false} loadingMessage="Loading charts..."/>}>
                            <PartnerCharts partners={data.partners}/>
                        </Suspense>
                    ) : null}
                </Tab>

            </Tabs>
        </>
    );
}

export default PartnerTableWithCharts;
