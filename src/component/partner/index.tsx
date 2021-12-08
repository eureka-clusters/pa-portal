import React from 'react';
import {ApiError, apiStates} from 'function/api';
import {Link, RouteComponentProps} from "react-router-dom";
import BreadcrumbTree from 'component/partial/breadcrumb-tree'
import NumberFormat from "react-number-format";
import {GetPartner} from "function/api/get-partner";

//Create the interface to identify the slug
interface MatchParams {
    slug: string
}

interface Props extends RouteComponentProps<MatchParams> {
}

export default function Partner(props: Props) {

    //'/api/view/project/' + identifier,
    const slug = props.match.params.slug;

    const {state, error, partner} = GetPartner(slug);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error}/>
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <pre className='debug'>{JSON.stringify(partner, undefined, 2)}</pre> */}

                    <BreadcrumbTree current="partner" data={{
                        ...partner, ...{
                            project_name: partner.project.name,
                            project_slug: partner.project.slug,
                            partner_name: partner.organisation.name,
                            partner_slug: partner.slug
                        }
                    }} linkCurrent={true}/>

                    <h1>{partner.organisation.name} in {partner.project.name}</h1>

                    <dl className="row">

                        <dt className="col-sm-3">Organisation:</dt>
                        <dd className="col-sm-9"><Link
                            to={`/organisation/${partner.organisation.slug}`}>{partner.organisation.name}</Link></dd>

                        <dt className="col-sm-3">Type:</dt>
                        <dd className="col-sm-9">{partner.organisation.type.type}</dd>

                        <dt className="col-sm-3">Country:</dt>
                        <dd className="col-sm-9">{partner.organisation.country.country}</dd>

                        <dt className="col-sm-3">Coordinator:</dt>
                        <dd className="col-sm-9">{partner.isCoordinator ? 'Yes' : 'No'}</dd>

                        <dt className="col-sm-3">Active:</dt>
                        <dd className="col-sm-9">{partner.isActive ? 'Yes' : 'No'}</dd>

                        <dt className="col-sm-3">Self Funded:</dt>
                        <dd className="col-sm-9">{partner.isSelfFunded ? 'Yes' : 'No'}</dd>

                        <dt className="col-sm-3">Technical contact:</dt>
                        <dd className="col-sm-9">
                            @johan still not camel case in this result "full_name" instead of "fullName"
                            <pre className='debug'>{JSON.stringify(partner.technicalContact, undefined, 2)}</pre>
                            {String(partner.technicalContact.fullName)} (<a
                            href={`mailto:${partner.technicalContact.email}`}>{partner.technicalContact.email}</a>)
                        </dd>

                        <dt className="col-sm-3">Total costs (latest version)</dt>
                        <dd className="col-sm-9"><NumberFormat
                            value={partner.latestVersionCosts}
                            thousandSeparator={' '}
                            displayType={'text'}
                            prefix={'€ '}/></dd>


                        <dt className="col-sm-3">Total effort (latest version)</dt>
                        <dd className="col-sm-9"><NumberFormat
                            value={partner.latestVersionEffort}
                            thousandSeparator={' '}
                            displayType={'text'}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        /></dd>


                        <dt className="col-sm-3">Project:</dt>
                        <dd className="col-sm-9"><Link
                            to={`/project/${partner.project.slug}`}>{partner.project.name}</Link></dd>

                        <dt className="col-sm-3">Project leader</dt>
                        <dd className="col-sm-9">
                            @johan still not camel case in this result "full_name" instead of "fullName"
                            <pre className='debug'>{JSON.stringify(partner.project.projectLeader, undefined, 2)}</pre>
                            
                            {String(partner.project.projectLeader.fullName)} (<a
                            href={`mailto:${partner.project.projectLeader.email}`}>{partner.project.projectLeader.email}</a>)
                        </dd>
                    </dl>


                </React.Fragment>
            );
        default:
            return <p>Loading partner...</p>;
    }
}