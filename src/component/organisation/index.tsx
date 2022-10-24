import React from 'react';
import {useParams} from "react-router-dom";
import BreadcrumbTree from 'component/partial/breadcrumb-tree'
import PartnerTable from "component/organisation/partner-table";
import {useOrganisation} from 'hooks/api/organisation/use-organisation';
import {ApiStates, RenderApiError} from "hooks/api/api-error";


export default function Organisation() {

    const {slug} = useParams();

    const {state, error, organisation} = useOrganisation(slug === undefined ? '' : slug);

    switch (state) {
        case ApiStates.ERROR:
            return <RenderApiError error={error}/>
        case ApiStates.SUCCESS:
            return (
                <React.Fragment>
                    <BreadcrumbTree current="organisation" data={organisation} linkCurrent={false}/>

                    <h1>{organisation.name}</h1>

                    <dl className="row">

                        <dt className="col-sm-3 text-end">Organisation:</dt>
                        <dd className="col-sm-9">{organisation.name}</dd>

                        <dt className="col-sm-3 text-end">Type:</dt>
                        <dd className="col-sm-9">{organisation.type.type}</dd>

                        <dt className="col-sm-3 text-end">Country:</dt>
                        <dd className="col-sm-9">{organisation.country.country}</dd>

                    </dl>

                    <PartnerTable organisation={organisation}/>

                </React.Fragment>
            );
        default:
            return <p>Loading organisation...</p>;
    }
}