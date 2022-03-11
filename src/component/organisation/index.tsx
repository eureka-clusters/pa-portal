import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import BreadcrumbTree from 'component/partial/breadcrumb-tree'
import PartnerTable from "component/organisation/partner-table";
import { useOrganisation, apiStates, ApiError } from 'hooks/api/organisation/useOrganisation'; 

//Create the interface to identify the slug
interface MatchParams {
    slug: string
}

interface Props extends RouteComponentProps<MatchParams> {
}

export default function Organisation(props: Props) {

    const slug = props.match.params.slug;
    const { state, error, organisation } = useOrganisation({ slug: slug });

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error}/>
        case apiStates.SUCCESS:
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