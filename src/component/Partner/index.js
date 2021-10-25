import React from 'react';
import { apiStates, Api,  ApiError } from '../../function/Api';
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

export const SiteMap = ({ hrefIn }) => {
    const items = [
        { href: "/projects", name: "Projects" },
        { href: "/partner", name: "Partner" },
    ];
    return (
        <Breadcrumb>
            {items.map((item, key) =>
                item.href === hrefIn ? (
                    <Breadcrumb.Item key={key} active>{item.name}</Breadcrumb.Item>
                ) : (
                    <Breadcrumb.Item key={key} linkProps={{ to: item.href }} linkAs={Link}>
                        {item.name}
                    </Breadcrumb.Item>
                )
            )}
        </Breadcrumb>
    );
};

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
                    {/* <p>Debug:</p>
                    <PrintObject value={data} /> */}

                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href={`/projects`}>Projects</Breadcrumb.Item>
                        <Breadcrumb.Item href={`/project/${data.project.projectIdentifier}/${data.project.name}`}>{data.project.name}</Breadcrumb.Item>
                        <Breadcrumb.Item active>{data.organisation.name}</Breadcrumb.Item>
                    </Breadcrumb>


                    {/* //@Johan, do you have an idea how can we could have a component where we could give variables like projectname + identifier to generate the breadcrumbs more dynamically? */}
                    <SiteMap hrefIn="/partner" />

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