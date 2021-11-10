import React from 'react';
import { apiStates, Api,  ApiError } from 'function/Api';
import { Link } from "react-router-dom";
import BreadcrumbTree from 'component/partial/BreadcrumbTree'
import NumberFormat from "react-number-format";

export default function Partner(props) {

    //'/api/view/project/' + identifier,
    const slug = props.match.params.slug;

    const { state, error, data } = Api('/view/partner/' + slug);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}

                    <BreadcrumbTree current="partner" data={{ ...data, ...{ 
                        project_name: data.project.name,
                        project_slug: data.project.slug,
                        partner_name: data.organisation.name,
                        partner_slug: data.slug
                    }
                    }} linkCurrent={true}/>

                    <h1>{data.organisation.name} in {data.project.name}</h1>

                    <dl className="row">

                    <dt className="col-sm-3">Organisation:</dt>
                        <dd className="col-sm-9"><Link to={`/organisation/${data.organisation.slug}`}>{data.organisation.name}</Link></dd>

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
                            {String(data.technicalContact.full_name)} (<a href={`mailto:${data.technicalContact.email}`}>{data.technicalContact.email}</a>)
                        </dd>

                        <dt className="col-sm-3">Total costs (latest version)</dt>
                        <dd className="col-sm-9"><NumberFormat
                            value={data.latestVersionCosts}
                            thousandSeparator={' '}
                            displayType={'text'}
                            prefix={'€ '} /></dd>


                        <dt className="col-sm-3">Total effort (latest version)</dt>
                        <dd className="col-sm-9"><NumberFormat
                            value={data.latestVersionEffort}
                            thousandSeparator={' '}
                            displayType={'text'}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        /></dd>

                                            
                        <dt className="col-sm-3">Project:</dt>
                        <dd className="col-sm-9"><Link to={`/project/${data.project.slug}`}>{data.project.name}</Link></dd>

                        <dt className="col-sm-3">Project leader</dt>
                        <dd className="col-sm-9">
                            {String(data.project.projectLeader.full_name)} (<a href={`mailto:${data.project.projectLeader.email}`}>{data.project.projectLeader.email}</a>)
                        </dd>
                    </dl>


                </React.Fragment>
            );
        default:
            return <p>Loading partner...</p>;
    }
}