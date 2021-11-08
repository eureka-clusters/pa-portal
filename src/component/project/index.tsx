import React from 'react';
import {ApiError, apiStates} from '../../function/api';
import PartnerTable from "./partner-table";
import BreadcrumbTree from '../partial/BreadcrumbTree'
import NumberFormat from "react-number-format";
import moment from 'moment';
import {RouteComponentProps} from "react-router-dom";
import {GetProject} from "../../function/api/get-project";

//Create the interface to identify the slug
interface MatchParams {
    slug: string
}

interface Props extends RouteComponentProps<MatchParams> {
}

export default function Project(props: Props) {

    const slug = props.match.params.slug;

    const {state, error, project} = GetProject(slug);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error}/>
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <pre className='debug'>{JSON.stringify(project, undefined, 2)}</pre> */}

                    <BreadcrumbTree current="project" data={{
                        ...project, ...{
                            project_name: project.name,
                            project_slug: project.slug,
                        }
                    }} linkCurrent={true}/>

                    <h1>Project Page</h1>

                    <dl className="row">
                        <dt className="col-sm-3">Project:</dt>
                        <dd className="col-sm-9">{project.name}</dd>

                        <dt className="col-sm-3">Status:</dt>
                        <dd className="col-sm-9">{project.status && project.status.status}</dd>

                        <dt className="col-sm-3">Primary Cluster:</dt>
                        <dd className="col-sm-9">{project.primaryCluster && project.primaryCluster.name}</dd>

                        <dt className="col-sm-3">Programme:</dt>
                        <dd className="col-sm-9">{project.programme}</dd>

                        {project.coordinator && <>
                            <dt className="col-sm-3">Coordinator:</dt>
                            <dd className="col-sm-9">{String(project.coordinator.organisation)}<br/>{String(project.coordinator.technicalContact.full_name)} ({String(project.coordinator.technicalContact.email)})
                            </dd>
                        </>}

                        <dt className="col-sm-3">Project leader:</dt>
                        <dd className="col-sm-9">{String(project.projectLeader.full_name)} ({String(project.projectLeader.email)})</dd>

                        <dt className="col-sm-3">TechnicalArea:</dt>
                        <dd className="col-sm-9">{project.technicalArea}</dd>

                        <dt className="col-sm-3">Label date:</dt>
                        <dd className="col-sm-9">
                            {project.labelDate}
                            <br/>
                            localized: {moment(project.labelDate).format('LLL')}
                            <br/>
                        </dd>

                        <dt className="col-sm-3">Total costs:</dt>
                        <dd className="col-sm-9"><NumberFormat
                            value={project.latestVersionTotalCosts}
                            thousandSeparator={' '}
                            displayType={'text'}
                            prefix={'€ '}/></dd>

                        <dt className="col-sm-3">Total effort:</dt>
                        <dd className="col-sm-9"><NumberFormat
                            value={project.latestVersionTotalEffort}
                            thousandSeparator={' '}
                            displayType={'text'}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        /></dd>

                        <dt className="col-sm-3">Description:</dt>
                        <dd className="col-sm-9">
                            <details>
                                <summary>open/close</summary>
                                <p>{project.description}</p>
                            </details>
                        </dd>
                    </dl>
                    <PartnerTable project={project}/>
                </React.Fragment>
            );
        default:
            return <p>Loading project...</p>;
    }
}