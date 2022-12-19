import React from 'react';
import PartnerTableWithCharts from "component/project/partner-table-with-charts";
import BreadcrumbTree from 'component/partial/breadcrumb-tree'
import moment from 'moment';
import {useGetProject} from "hooks/project/use-get-project";
import {CostsFormat, EffortFormat} from 'functions/utils';
import {useParams} from "react-router-dom";


export default function Project() {

    const {slug} = useParams();
    const {state} = useGetProject(slug === undefined ? '' : slug);

    if (state.isLoading) {
        return <div>Loading...</div>
    }

    const project = state.data;

    return <>
        <BreadcrumbTree current="project" data={{
            ...project, ...{
                project_name: project.name,
                project_slug: project.slug,
            }
        }} linkCurrent={true}/>

        <h1>Project Page</h1>

        <dl className="row">
            <dt className="col-sm-3 text-end">Identification Number:</dt>
            <dd className="col-sm-9">{project.number}</dd>

            <dt className="col-sm-3 text-end">Project:</dt>
            <dd className="col-sm-9">{project.name}</dd>

            <dt className="col-sm-3 text-end">Status:</dt>
            <dd className="col-sm-9">{project.status && project.status.status}</dd>

            <dt className="col-sm-3 text-end">Primary Cluster:</dt>
            <dd className="col-sm-9">{project.primaryCluster && project.primaryCluster.name}</dd>

            <dt className="col-sm-3 text-end">Secondary Cluster:</dt>
            <dd className="col-sm-9">{project.secondaryCluster && project.secondaryCluster.name}</dd>

            <dt className="col-sm-3 text-end">Programme:</dt>
            <dd className="col-sm-9">{project.programme}</dd>

            <dt className="col-sm-3 text-end">Programme Call:</dt>
            <dd className="col-sm-9">{project.programmeCall}</dd>


            {project.coordinator && <>
                <dt className="col-sm-3 text-end">Coordinator:</dt>
                <dd className="col-sm-9">{String(project.coordinator.organisation)}<br/>
                    {project.coordinator.technicalContact && <>
                        {String(project.coordinator.technicalContact.fullName)}
                        {project.coordinator.technicalContact.email ? ` (${String(project.coordinator.technicalContact.email)})` : ''}
                    </>}
                </dd>
            </>}


            <dt className="col-sm-3 text-end">Project leader:</dt>
            <dd className="col-sm-9">{String(project.projectLeader.fullName)} ({String(project.projectLeader.email)})</dd>

            <dt className="col-sm-3 text-end">TechnicalArea:</dt>
            <dd className="col-sm-9">{project.technicalArea}</dd>

            <dt className="col-sm-3 text-end">Label date:</dt>
            <dd className="col-sm-9">{moment(project.labelDate).format('LLL')}</dd>

            <dt className="col-sm-3 text-end">Total costs:</dt>
            <dd className="col-sm-9">
                <CostsFormat value={project.latestVersionTotalCosts}/>
            </dd>

            <dt className="col-sm-3 text-end">Total effort:</dt>
            <dd className="col-sm-9">
                <EffortFormat value={project.latestVersionTotalEffort}/>
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