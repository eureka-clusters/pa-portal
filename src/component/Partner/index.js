import React from 'react';
import { apiStates, Api,  ApiError } from '../../function/Api';
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import BreadcrumbTree from '../partial/BreadcrumbTree'
// import PrintObject from '../../function/react-print-object';

export default function Partner(props) {

    //'/api/view/project/' + identifier,
    const identifier = props.match.params.identifier;

    const { state, error, data } = Api('/view/partner/' + identifier);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <p>Debug:</p><PrintObject value={data} /> */}
                    
                    <BreadcrumbTree current="partner_detail" data={data} linkCurrent={true}/>

                    <h1>{data.organisation.name} in {data.project.name}</h1>

                    <dl className="row">

                    <dt className="col-sm-3">Organisation:</dt>
                        <dd className="col-sm-9"><Link to={`/organisation/${data.organisation.id}/${data.organisation.name}`}>{data.organisation.name}</Link></dd>

                        <dt className="col-sm-3">Type:</dt>
                        <dd className="col-sm-9">{data.organisation.type.type}</dd>

                        <dt className="col-sm-3">Country:</dt>
                        <dd className="col-sm-9">{data.organisation.country.country}</dd>

                        <dt className="col-sm-3">Coordinator:</dt>
                        <dd className="col-sm-9">{data.isCoordinator ? 'Yes' : 'No'}</dd>

                        <dt className="col-sm-3">Active:</dt>
                        <dd className="col-sm-9">{data.isActive ? 'Yes' : 'No'}</dd>

                        <dt className="col-sm-3">Self Funded:</dt>
                        <dd className="col-sm-9">{data.isSelfFunded ? 'Yes' : 'No'}</dd>

                        <dt className="col-sm-3">Technical contact:</dt>
                        <dd className="col-sm-9">
                            {String(data.technicalContact.first_name)} {String(data.technicalContact.last_name)} (<a href={`mailto:${data.technicalContact.email}`}>{data.technicalContact.email}</a>)
                        </dd>

                        <dt className="col-sm-3">Total costs (latest version)</dt>
                        <dd className="col-sm-9">{data.latestVersionCosts}</dd>


                        <dt className="col-sm-3">Total effort (latest version)</dt>
                        <dd className="col-sm-9">{data.latestVersionEffort}</dd>

                    
                        <dt className="col-sm-3">Project:</dt>
                        <dd className="col-sm-9"><Link to={`/project/${data.project.identifier}/${data.project.name}`}>{data.project.name}</Link></dd>

                        <dt className="col-sm-3">Project leader</dt>
                        <dd className="col-sm-9">
                            {String(data.project.projectLeader.first_name)} {String(data.project.projectLeader.last_name)} (<a href={`mailto:${data.project.projectLeader.email}`}>{data.project.projectLeader.email}</a>)
                        </dd>
                    </dl>


                </React.Fragment>
            );
        default:
            return <p>Loading partner...</p>;
    }
}