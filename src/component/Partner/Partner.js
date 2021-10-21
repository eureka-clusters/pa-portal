import React, { useEffect, useState } from 'react';
import { apiStates, Api, getFilter, ApiError } from '../../function/Api';
import Button from 'react-bootstrap/Button'
import PrintObject from '../../function/react-print-object'
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

export const SiteMap = ({ hrefIn }) => {
    const items = [
        { href: "/projects", name: "Projects" },
        { href: "/partner", name: "Partner" },
    ];
    return (
        <Breadcrumb>
            {items.map((item) =>
                item.href === hrefIn ? (
                    <Breadcrumb.Item active>{item.name}</Breadcrumb.Item>
                ) : (
                    <Breadcrumb.Item linkProps={{ to: item.href }} linkAs={Link}>
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
    const [url, setUrl] = React.useState('/view/partner/' + identifier );

    const { state, error, data, load } = Api(url);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <p>Debug:</p>
                    <PrintObject value={data} />

                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href={`/projects`}>Projects</Breadcrumb.Item>
                        <Breadcrumb.Item href={`/project/${data.projectIdentifier}/${data.projectName}`}>{data.projectName}</Breadcrumb.Item>
                        <Breadcrumb.Item active>{data.partner}</Breadcrumb.Item>
                    </Breadcrumb>


                    {/* //@Johan, do you have an idea how can we could have a component where we could give variables like projectname + identifier to generate the breadcrumbs more dynamically? */}
                    <SiteMap hrefIn="/partner"/>  

                    <h1>Partner "{data.partner}"</h1>

                    <dl className="row">
                        <dt className="col-sm-3">Type:</dt>
                        <dd className="col-sm-9">{data.partnerType}</dd>

                        <dt className="col-sm-3">Coordinator:</dt>
                        <dd className="col-sm-9">{String(data.coordinator)}</dd>

                        <dt className="col-sm-3">Active:</dt>
                        <dd className="col-sm-9">{String(data.active)}</dd>

                        <dt className="col-sm-3">Self Funded:</dt>
                        <dd className="col-sm-9">{String(data.selfFunded)}</dd>

                        <dt className="col-sm-3">TechnicalContact:</dt>
                        <dd className="col-sm-9">
                            <address>
                                <strong>{data.technicalContact.name}</strong><br />
                                <a href={`mailto:${data.technicalContact.email}`}>{data.technicalContact.email}</a>
                            </address>
                        </dd>
                    </dl>

                    <div className="row">
                        <div className="col-sm-6 mb-3">
                            {/* <div className="card" style={{ width: '18rem' }}> */}
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{data.projectLeader.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Project Leader</h6>
                                    {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                                
                                    
                                    <address>
                                        {data.projectLeader.address}
                                        <br />
                                        {data.projectLeader.zip_code}&nbsp;{data.projectLeader.city}
                                        <br />
                                        {data.projectLeader.country}
                                    </address>
                                
                                    <a href={`mailto:${data.projectLeader.email}`} className="card-link">{data.projectLeader.email}</a>
                                    {/* <a href="#" className="card-link">Another link</a> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 mb-3">
                            {/* <div className="card" style={{ width: '18rem' }}> */}
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{data.technicalContact.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Technical Contact</h6>
                                    {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                                    <a href={`mailto:${data.technicalContact.email}`} className="card-link">{data.technicalContact.email}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                   
                </React.Fragment>
            );
        default:
            return <p>Loading partner...</p>;
    }
}