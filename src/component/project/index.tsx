import React, {useContext} from 'react';
import moment from 'moment';
import {getProject} from "@/hooks/project/get-project";
import {CostsFormat, EffortFormat} from '@/functions/utils';
import {useParams} from "react-router-dom";
import PartnerTableWithCharts from "@/component/project/partner-table-with-charts";
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery} from "@tanstack/react-query";
import {UserContext} from "@/providers/user-provider";

export default function Project() {

    const {slug} = useParams();

    if (slug === undefined) {
        return <div>Error</div>;
    }

    const authAxios = useContext(AxiosContext).authAxios;
    const user = useContext(UserContext).getUser();

    const {isLoading, isError, data: project} = useQuery({
        queryKey: ['project', slug],
        keepPreviousData: true,
        queryFn: () => getProject({authAxios, slug})
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    return <>
        <dl className="row">
            <dt className="col-sm-3 text-end">Identification Number:</dt>
            <dd className="col-sm-9">{project.number}</dd>

            <dt className="col-sm-3 text-end">Project:</dt>
            <dd className="col-sm-9">{project.name}</dd>

            <dt className="col-sm-3 text-end">Status:</dt>
            <dd className="col-sm-9">{project.status && project.status.status}</dd>

            <dt className="col-sm-3 text-end">Primary Cluster:</dt>
            <dd className="col-sm-9">{project.primaryCluster && project.primaryCluster.name}</dd>

            {project.secondaryCluster && <React.Fragment>
                <dt className="col-sm-3 text-end">Secondary Cluster:</dt>
                <dd className="col-sm-9">{project.secondaryCluster.name}</dd>
            </React.Fragment>}

            <dt className="col-sm-3 text-end">Programme:</dt>
            <dd className="col-sm-9">{project.programme}</dd>

            <dt className="col-sm-3 text-end">Programme Call:</dt>
            <dd className="col-sm-9">{project.programmeCall}</dd>


            {project.coordinator && <>
                <dt className="col-sm-3 text-end">Coordinator:</dt>
                <dd className="col-sm-9">{String(project.coordinator.organisation)}<br/>
                    {project.coordinator.technicalContact && <>
                        {String(project.coordinator.technicalContact.fullName)}
                        {project.coordinator.technicalContact.email && !user.isEurekaSecretariatStaffMember ? ` (${String(project.coordinator.technicalContact.email)})` : ''}
                    </>}
                </dd>
            </>}


            <dt className="col-sm-3 text-end">Project leader:</dt>
            <dd className="col-sm-9">{String(project.projectLeader.fullName)}

                {project.projectLeader.email && !user.isEurekaSecretariatStaffMember ? ` (${String(project.projectLeader.email)})` : ''}

            </dd>

            <dt className="col-sm-3 text-end">TechnicalArea:</dt>
            <dd className="col-sm-9">{project.technicalArea}</dd>

            <dt className="col-sm-3 text-end">Label date:</dt>
            <dd className="col-sm-9">{moment(project.labelDate).format('LLL')}</dd>

            <dt className="col-sm-3 text-end">Total costs:</dt>
            <dd className="col-sm-9">
                <CostsFormat>{project.latestVersionTotalCosts}</CostsFormat>
            </dd>

            <dt className="col-sm-3 text-end">Total effort:</dt>
            <dd className="col-sm-9">
                <EffortFormat>{project.latestVersionTotalEffort}</EffortFormat>
            </dd>

            <dt className="col-sm-3 text-end">Description:</dt>
            <dd className="col-sm-9">
                <details>
                    <summary>open/close</summary>
                    <p>{project.description}</p>
                </details>
            </dd>
        </dl>
        <PartnerTableWithCharts project={project}/>
    </>;
}