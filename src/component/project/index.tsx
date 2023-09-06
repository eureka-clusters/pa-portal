import React, {useContext} from 'react';
import {getProject} from "@/hooks/project/get-project";
import {CostsFormat, EffortFormat} from '@/functions/utils';
import {useParams} from "react-router-dom";
import PartnerTableWithCharts from "@/component/project/partner-table-with-charts";
import {AxiosContext} from "@/providers/axios-provider";
import {useQueries} from "@tanstack/react-query";
import {UserContext} from "@/providers/user-provider";
import Moment from "react-moment";
import {getProjectVersions} from "@/hooks/project/versions/get-versions";

export default function Project() {

    const {slug} = useParams();

    if (slug === undefined) {
        return <div>Error</div>;
    }

    const authAxios = useContext(AxiosContext).authAxios;
    const user = useContext(UserContext).getUser();

    const [
        projectQuery,
        versionQuery,
    ] = useQueries({
        queries: [
            {
                queryKey: ['project', slug],
                queryFn: () => getProject({authAxios, slug})
            },
            {
                queryKey: ['versions', slug],
                queryFn: () => getProjectVersions({authAxios, projectSlug: slug})
            },
        ]
    })

    if (projectQuery.isLoading) {
        return <div>Loading...</div>;
    }

    if (projectQuery.isError) {
        return <div>Error</div>;
    }

    const project = projectQuery.data;

    return <>
        <h1>{project.name}</h1>
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

            {project.labelDate && <>
                <dt className="col-sm-3 text-end">Label date:</dt>
                <dd className="col-sm-9"><Moment format={'DD MMM YYYY'}>{project.labelDate}</Moment></dd>
            </>}

            {project.officialStartDate && <>
                <dt className="col-sm-3 text-end">Start date:</dt>
                <dd className="col-sm-9"><Moment format={'DD MMM YYYY'}>{project.officialStartDate}</Moment></dd>
            </>}

            {project.officialEndDate && <>
                <dt className="col-sm-3 text-end">End date:</dt>
                <dd className="col-sm-9"><Moment format={'DD MMM YYYY'}>{project.officialEndDate}</Moment></dd>
            </>}

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

        This project has the following versions:
        <table className="table table-striped table-sm">
            <thead>
            <tr>
                <th>Type</th>
                <th>Status</th>
                <th>Date submitted</th>
                <th>Total costs</th>
                <th>Total effort</th>
            </tr>
            </thead>
            <tbody>
            {versionQuery.data?.versions.filter((version) => {
                return !version.isLatestVersionAndIsFPP
            }).map((version) => {
                return <tr key={version.id}>
                    <td>
                        {version.type.description}</td>
                    <td>{version.status.status}</td>
                    <td><Moment format={'DD MMM YYYY'}>{version.dateSubmitted}</Moment></td>
                    <td><CostsFormat>{version.costs}</CostsFormat></td>
                    <td><EffortFormat>{version.effort}</EffortFormat></td>
                </tr>
            })}
            </tbody>
        </table>

        <PartnerTableWithCharts project={project}/>
    </>;
}