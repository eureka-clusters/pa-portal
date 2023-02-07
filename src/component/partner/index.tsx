import React, {useContext} from 'react';

import {Link, useParams} from "react-router-dom";
import {CostsFormat, EffortFormat} from '@/functions/utils';
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery} from "@tanstack/react-query";
import {getPartner} from "@/hooks/partner/get-partner";

export default function Partner() {

    const {slug} = useParams();
    if (slug === undefined) {
        return <div>Error</div>;
    }

    const authAxios = useContext(AxiosContext).authAxios;

    const {isLoading, isError, data: partner} = useQuery({
        queryKey: ['partner', slug],
        keepPreviousData: true,
        queryFn: () => getPartner({authAxios, slug})
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    return (
        <React.Fragment>
            <h1>{partner.organisation.name} in {partner.project.name}</h1>

            <dl className="row">

                <dt className="col-sm-3 text-end">Organisation:</dt>
                <dd className="col-sm-9"><Link
                    to={`/organisations/${partner.organisation.slug}`}>{partner.organisation.name}</Link></dd>

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
                <dd className="col-sm-9">
                    <CostsFormat>{partner.latestVersionCosts}</CostsFormat>
                </dd>

                <dt className="col-sm-3 text-end">Total effort (latest version)</dt>
                <dd className="col-sm-9">
                    <EffortFormat>{partner.latestVersionEffort}</EffortFormat>
                </dd>

                <dt className="col-sm-3 text-end">Project:</dt>
                <dd className="col-sm-9"><Link
                    to={`/projects/${partner.project.slug}`}>{partner.project.name}</Link></dd>

                <dt className="col-sm-3 text-end">Project leader</dt>
                <dd className="col-sm-9">
                    {String(partner.project.projectLeader.fullName)} (<a
                    href={`mailto:${partner.project.projectLeader.email}`}>{partner.project.projectLeader.email}</a>)
                </dd>
            </dl>


        </React.Fragment>)

}