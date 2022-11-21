import React from 'react';
import {useParams} from "react-router-dom";
import BreadcrumbTree from 'component/partial/breadcrumb-tree'
import PartnerTable from "component/organisation/partner-table";
import {useGetOrganisation} from "hooks/organisation/use-get-organisation";

export default function Organisation() {

    const {slug} = useParams();

    const {state} = useGetOrganisation(slug === undefined ? '' : slug);

    if (state.isLoading) {
        return <div>Loading...</div>
    }

    let organisation = state.data;

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
    )
}