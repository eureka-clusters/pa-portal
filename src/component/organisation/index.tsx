import React from 'react';
import {ApiError, apiStates} from '../../function/api';
import {Link, RouteComponentProps} from "react-router-dom";
import BreadcrumbTree from '../partial/BreadcrumbTree'
import {GetOrganisation} from "../../function/api/get-organisation";
import PartnerTable from "./partner-table";

//Create the interface to identify the slug
interface MatchParams {
    slug: string
}

interface Props extends RouteComponentProps<MatchParams> {
}


export default function Organisation(props: Props) {

    const slug = props.match.params.slug;
    const {state, error, organisation} = GetOrganisation(slug);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error}/>
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <p>Debug:</p><PrintObject value={organisation} /> */}
                    <BreadcrumbTree current="organisation" data={organisation} linkCurrent={false}/>

                    <h1>{organisation.name}</h1>

                    <dl className="row">

                        <dt className="col-sm-3">Organisation:</dt>
                        <dd className="col-sm-9"><Link
                            to={`/organisation/${organisation.id}/${organisation.name}`}>{organisation.name}</Link>
                        </dd>

                        <dt className="col-sm-3">Type:</dt>
                        <dd className="col-sm-9">{organisation.type.type}</dd>

                        <dt className="col-sm-3">Country:</dt>
                        <dd className="col-sm-9">{organisation.country.country}</dd>

                    </dl>

                    <PartnerTable organisation={organisation}/>

                </React.Fragment>
            );
        default:
            return <p>Loading organisation...</p>;
    }
}