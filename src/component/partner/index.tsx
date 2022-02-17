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

                        <dt className="col-sm-3 text-end">Organisation:</dt>
                        <dd className="col-sm-9"><Link
                            to={`/organisation/${partner.organisation.slug}`}>{partner.organisation.name}</Link></dd>

                        <dt className="col-sm-3 text-end">Type:</dt>
                        <dd className="col-sm-9">{partner.organisation.type.type}</dd>

                        <dt className="col-sm-3 text-end">Country:</dt>
                        <dd className="col-sm-9">{partner.organisation.country.country}</dd>

                        <dt className="col-sm-3 text-end">Coordinator:</dt>
                        <dd className="col-sm-9">{partner.isCoordinator ? 'Yes' : 'No'}</dd>

                        <dt className="col-sm-3 text-end">Active:</dt>
                        <dd className="col-sm-9">{partner.isActive ? 'Yes' : 'No'}</dd>

                        <dt className="col-sm-3 text-end">Self Funded:</dt>
                        <dd className="col-sm-9">{partner.isSelfFunded ? 'Yes' : 'No'}</dd>

                        <dt className="col-sm-3 text-end">Technical contact:</dt>
                        <dd className="col-sm-9">
                            {String(partner.technicalContact.fullName)} (<a
                            href={`mailto:${partner.technicalContact.email}`}>{partner.technicalContact.email}</a>)
                        </dd>

                        <dt className="col-sm-3 text-end">Total costs (latest version)</dt>
                        <dd className="col-sm-9"><NumberFormat
                            value={partner.latestVersionCosts}
                            thousandSeparator={' '}
                            displayType={'text'}
                            prefix={'€ '}/></dd>


                        <dt className="col-sm-3 text-end">Total effort (latest version)</dt>
                        <dd className="col-sm-9"><NumberFormat
                            value={partner.latestVersionEffort}
                            thousandSeparator={' '}
                            displayType={'text'}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        /></dd>


                        <dt className="col-sm-3 text-end">Project:</dt>
                        <dd className="col-sm-9"><Link
                            to={`/project/${partner.project.slug}`}>{partner.project.name}</Link></dd>

                        <dt className="col-sm-3 text-end">Project leader</dt>
                        <dd className="col-sm-9">
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