import React, {useContext} from 'react';
import {useParams} from "react-router-dom";
import PartnerTable from "@/component/organisation/partner-table";
import {getOrganisation} from "@/hooks/organisation/get-organisation";
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery} from "@tanstack/react-query";

export default function Organisation() {

    const {slug} = useParams();

    if (slug === undefined) {
        return <div>Error</div>;
    }

    const authAxios = useContext(AxiosContext).authAxios;

    const {isLoading, isError, data: organisation} = useQuery({
        queryKey: ['organisation', slug],
        keepPreviousData: true,
        queryFn: () => getOrganisation({authAxios, slug})
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    return (
        <React.Fragment>
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