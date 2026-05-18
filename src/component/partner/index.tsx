import {useQuery} from "@tanstack/react-query";
import {Link, useParams} from "react-router-dom";

import {QueryState} from "@/component/partial/query-state";
import {CostsFormat, EffortFormat} from "@/functions/utils";
import {getPartner} from "@/hooks/partner/get-partner";
import {useAxios} from "@/providers/axios-provider";
import {useUser} from "@/providers/user-provider";

export default function Partner() {
    const {slug} = useParams();
    const {authAxios} = useAxios();
    const {user} = useUser();

    if (!slug) {
        return <div>No project partner was selected.</div>;
    }

    const partnerQuery = useQuery({
        queryKey: ["partner", slug],
        queryFn: () => getPartner({authAxios, slug}),
    });

    if (partnerQuery.isLoading || partnerQuery.isError) {
        return (
            <QueryState
                isLoading={partnerQuery.isLoading}
                isError={partnerQuery.isError}
                errorMessage="The partner details could not be loaded."
            />
        );
    }

    const partner = partnerQuery.data;
    const showEmail = !user?.isEurekaSecretariatStaffMember;

    if (!partner) {
        return <div>No partner data is available.</div>;
    }

    return (
        <>
            <h1>{partner.organisation.name} in {partner.project.name}</h1>

            <dl className="row">
                <dt className="col-sm-3 text-end">Organisation:</dt>
                <dd className="col-sm-9">
                    <Link to={`/organisations/${partner.organisation.slug}`}>{partner.organisation.name}</Link>
                </dd>

                <dt className="col-sm-3 text-end">Type:</dt>
                <dd className="col-sm-9">{partner.organisation.type.type}</dd>

                <dt className="col-sm-3 text-end">Country:</dt>
                <dd className="col-sm-9">{partner.organisation.country.country}</dd>

                <dt className="col-sm-3 text-end">Coordinator:</dt>
                <dd className="col-sm-9">{partner.isCoordinator ? "Yes" : "No"}</dd>

                <dt className="col-sm-3 text-end">Active:</dt>
                <dd className="col-sm-9">{partner.isActive ? "Yes" : "No"}</dd>

                <dt className="col-sm-3 text-end">Self Funded:</dt>
                <dd className="col-sm-9">{partner.isSelfFunded ? "Yes" : "No"}</dd>

                <dt className="col-sm-3 text-end">Technical contact:</dt>
                <dd className="col-sm-9">
                    {partner.technicalContact.fullName}
                    {partner.technicalContact.email && showEmail ? ` (${partner.technicalContact.email})` : ""}
                </dd>

                {partner.latestVersionCosts !== null ? (
                    <>
                        <dt className="col-sm-3 text-end">Total costs (latest version)</dt>
                        <dd className="col-sm-9">
                            <CostsFormat>{partner.latestVersionCosts}</CostsFormat>
                        </dd>
                    </>
                ) : null}

                <dt className="col-sm-3 text-end">Total effort (latest version)</dt>
                <dd className="col-sm-9">
                    <EffortFormat>{partner.latestVersionEffort}</EffortFormat>
                </dd>

                <dt className="col-sm-3 text-end">Project:</dt>
                <dd className="col-sm-9">
                    <Link to={`/project/${partner.project.slug}`}>{partner.project.name}</Link>
                </dd>

                <dt className="col-sm-3 text-end">Project leader</dt>
                <dd className="col-sm-9">
                    {partner.project.projectLeader.fullName}
                    {partner.project.projectLeader.email && showEmail ? ` (${partner.project.projectLeader.email})` : ""}
                </dd>
            </dl>
        </>
    );
}
