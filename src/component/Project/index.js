import React, { useEffect, useState } from 'react';
import { apiStates, Api, ApiError } from '../../function/Api';
import Moment from 'react-moment';
import PrintObject from '../../function/react-print-object'
import { Breadcrumb } from "react-bootstrap";
import PartnerTable from './partner-table';
import BreadcrumbTree from '../partial/BreadcrumbTree'
import moment from 'moment';

export default function Project(props) {

    //'/api/view/project/' + identifier,
    const identifier = props.match.params.identifier;
    const [url, setUrl] = React.useState('/view/project/' + identifier);

    const { state, error, data, load } = Api(url);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>

                    <BreadcrumbTree current="project_detail" data={data} />
                    <h1>Project Page</h1>

                    <dl className="row">
                        <dt className="col-sm-3">Project:</dt>
                        <dd className="col-sm-9">{data.name}</dd>

                        <dt className="col-sm-3">Status:</dt>
                        <dd className="col-sm-9">{data.status && data.status.status}</dd>

                        <dt className="col-sm-3">Primary Cluster:</dt>
                        <dd className="col-sm-9">{data.primaryCluster && data.primaryCluster.name}</dd>

                        <dt className="col-sm-3">Programme:</dt>
                        <dd className="col-sm-9">{data.programme}</dd>

                        <dt className="col-sm-3">Coordinator:</dt>
                        <dd className="col-sm-9">{String(data.coordinator)}</dd>


                        <dt className="col-sm-3">Project leader:</dt>
                        <dd className="col-sm-9">{String(data.projectLeader.first_name)} {String(data.projectLeader.last_name)} ({String(data.projectLeader.email)})</dd>

                        <dt className="col-sm-3">TechnicalArea:</dt>
                        <dd className="col-sm-9">{data.technicalArea}</dd>
                       
                        <dt className="col-sm-3">Label date:</dt>
                        <dd className="col-sm-9">
                            {data.labelDate}
                            <br />
                            localized: {moment(data.labelDate).format('LLL')}
                            <br />
                        </dd>

                        <dt className="col-sm-3">Total costs:</dt>
                        <dd className="col-sm-9">{data.latestVersionTotalCosts}</dd>

                        <dt className="col-sm-3">Total effort:</dt>
                        <dd className="col-sm-9">{data.latestVersionTotalEffort}</dd>
                        
                        <dt className="col-sm-3">Description:</dt>
                        <dd className="col-sm-9">
                            <details>
                                <summary>open/close</summary>
                                <p>{data.description}</p>
                            </details>
                        </dd>
                    </dl>
                    <PartnerTable project={data}/>
                </React.Fragment>
            );
        default:
            return <p>Loading project...</p>;
    }
}