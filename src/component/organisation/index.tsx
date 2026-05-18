import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";

import PartnerTable from "@/component/organisation/partner-table";
import {QueryState} from "@/component/partial/query-state";
import {getOrganisation} from "@/hooks/organisation/get-organisation";
import {useAxios} from "@/providers/axios-provider";

export default function Organisation() {
    const {slug} = useParams();
    const {authAxios} = useAxios();

    if (!slug) {
        return <div>No organisation was selected.</div>;
    }

    const organisationQuery = useQuery({
        queryKey: ["organisation", slug],
        queryFn: () => getOrganisation({authAxios, slug}),
    });

    if (organisationQuery.isLoading || organisationQuery.isError) {
        return (
            <QueryState
                isLoading={organisationQuery.isLoading}
                isError={organisationQuery.isError}
                errorMessage="The organisation details could not be loaded."
            />
        );
    }

    const organisation = organisationQuery.data;

    if (!organisation) {
        return <div>No organisation data is available.</div>;
    }

    return (
        <>
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
        </>
    );
}
