import React from 'react';
import { apiStates, Api, ApiError } from 'function/Api';
import PartnerTable from './partner-table';
import BreadcrumbTree from 'component/partial/BreadcrumbTree'
import NumberFormat from "react-number-format";
import moment from 'moment';

export default function Project(props) {

    const slug = props.match.params.slug;

    const { state, error, data } = Api('/view/project/' + slug);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}

                    <BreadcrumbTree current="project" data={{
                        ...data, ...{
                            project_name: data.name,
                            project_slug: data.slug,
                        }
                    }} linkCurrent={true} />

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

                        {data.coordinator && <>
                            <dt className="col-sm-3">Coordinator:</dt>
                            <dd className="col-sm-9">{String(data.coordinator.organisation)}<br />{String(data.coordinator.technicalContact.full_name)} ({String(data.coordinator.technicalContact.email)})</dd>
                        </>}

                        <dt className="col-sm-3">Project leader:</dt>
                        <dd className="col-sm-9">{String(data.projectLeader.full_name)} ({String(data.projectLeader.email)})</dd>

                        <dt className="col-sm-3">TechnicalArea:</dt>
                        <dd className="col-sm-9">{data.technicalArea}</dd>

                        <dt className="col-sm-3">Label date:</dt>
                        <dd className="col-sm-9">{moment(data.labelDate).format('LLL')}</dd>

                        <dt className="col-sm-3">Total costs:</dt>
                        <dd className="col-sm-9"><NumberFormat
                            value={data.latestVersionTotalCosts}
                            thousandSeparator={' '}
                            displayType={'text'}
                            prefix={'€ '} /></dd>

                        <dt className="col-sm-3">Total effort:</dt>
                        <dd className="col-sm-9"><NumberFormat
                            value={data.latestVersionTotalEffort}
                            thousandSeparator={' '}
                            displayType={'text'}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        /></dd>

                        <dt className="col-sm-3">Description:</dt>
                        <dd className="col-sm-9">
                            <details>
                                <summary>open/close</summary>
                                <p>{data.description}</p>
                            </details>
                        </dd>
                    </dl>
                    <PartnerTable project={data} />
                </React.Fragment>
            );
        default:
            return <p>Loading project...</p>;
    }
}