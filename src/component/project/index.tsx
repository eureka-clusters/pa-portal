import {useQuery} from "@tanstack/react-query";
import {lazy, Suspense} from "react";
import {useParams} from "react-router-dom";

import {QueryState} from "@/component/partial/query-state";
import {CostsFormat, DateFormat, EffortFormat} from "@/functions/utils";
import {getProject} from "@/hooks/project/get-project";
import {getProjectVersions} from "@/hooks/project/versions/get-versions";
import {useAxios} from "@/providers/axios-provider";
import {useUser} from "@/providers/user-provider";

const PartnerTableWithCharts = lazy(() => import("@/component/project/partner-table-with-charts"));

export default function Project() {
    const {slug} = useParams();
    const {authAxios} = useAxios();
    const {user} = useUser();

    if (!slug) {
        return <div>No project was selected.</div>;
    }

    const projectQuery = useQuery({
        queryKey: ["project", slug],
        queryFn: () => getProject({authAxios, slug}),
    });

    const versionsQuery = useQuery({
        queryKey: ["versions", slug],
        queryFn: () => getProjectVersions({authAxios, projectSlug: slug}),
    });

    if (projectQuery.isLoading || versionsQuery.isLoading || projectQuery.isError || versionsQuery.isError) {
        return (
            <QueryState
                isLoading={projectQuery.isLoading || versionsQuery.isLoading}
                isError={projectQuery.isError || versionsQuery.isError}
                errorMessage="The project details could not be loaded."
            />
        );
    }

    const project = projectQuery.data;
    const showEmail = !user?.isEurekaSecretariatStaffMember;

    if (!project) {
        return <div>No project data is available.</div>;
    }

    return (
        <>
            <h1>{project.name}</h1>
            <dl className="row">
                <dt className="col-sm-3 text-end">Identification Number:</dt>
                <dd className="col-sm-9">{project.number}</dd>

                <dt className="col-sm-3 text-end">Project:</dt>
                <dd className="col-sm-9">{project.name}</dd>

                <dt className="col-sm-3 text-end">Status:</dt>
                <dd className="col-sm-9">{project.status?.status}</dd>

                <dt className="col-sm-3 text-end">Primary Cluster:</dt>
                <dd className="col-sm-9">{project.primaryCluster?.name}</dd>

                {project.secondaryCluster ? (
                    <>
                        <dt className="col-sm-3 text-end">Secondary Cluster:</dt>
                        <dd className="col-sm-9">{project.secondaryCluster.name}</dd>
                    </>
                ) : null}

                <dt className="col-sm-3 text-end">Programme:</dt>
                <dd className="col-sm-9">{project.programme}</dd>

                <dt className="col-sm-3 text-end">Programme Call:</dt>
                <dd className="col-sm-9">{project.programmeCall}</dd>

                {project.coordinator ? (
                    <>
                        <dt className="col-sm-3 text-end">Coordinator:</dt>
                        <dd className="col-sm-9">
                            {String(project.coordinator.organisation)}
                            <br/>
                            {project.coordinator.technicalContact ? (
                                <>
                                    {project.coordinator.technicalContact.fullName}
                                    {project.coordinator.technicalContact.email && showEmail
                                        ? ` (${project.coordinator.technicalContact.email})`
                                        : ""}
                                </>
                            ) : null}
                        </dd>
                    </>
                ) : null}

                <dt className="col-sm-3 text-end">Project leader:</dt>
                <dd className="col-sm-9">
                    {project.projectLeader.fullName}
                    {project.projectLeader.email && showEmail ? ` (${project.projectLeader.email})` : ""}
                </dd>

                <dt className="col-sm-3 text-end">Technical Area:</dt>
                <dd className="col-sm-9">{project.technicalArea}</dd>

                {project.labelDate ? (
                    <>
                        <dt className="col-sm-3 text-end">Label date:</dt>
                        <dd className="col-sm-9"><DateFormat>{project.labelDate}</DateFormat></dd>
                    </>
                ) : null}

                {project.officialStartDate ? (
                    <>
                        <dt className="col-sm-3 text-end">Start date:</dt>
                        <dd className="col-sm-9"><DateFormat>{project.officialStartDate}</DateFormat></dd>
                    </>
                ) : null}

                {project.officialEndDate ? (
                    <>
                        <dt className="col-sm-3 text-end">End date:</dt>
                        <dd className="col-sm-9"><DateFormat>{project.officialEndDate}</DateFormat></dd>
                    </>
                ) : null}

                <dt className="col-sm-3 text-end">Total costs:</dt>
                <dd className="col-sm-9">
                    <CostsFormat>{project.latestVersionCosts}</CostsFormat>
                </dd>

                <dt className="col-sm-3 text-end">Total effort:</dt>
                <dd className="col-sm-9">
                    <EffortFormat>{project.latestVersionEffort}</EffortFormat>
                </dd>

                <dt className="col-sm-3 text-end">Description:</dt>
                <dd className="col-sm-9">
                    <details>
                        <summary>Open/close</summary>
                        <p>{project.description}</p>
                    </details>
                </dd>
            </dl>

            <p>This project has the following versions:</p>
            <table className="table table-striped table-sm">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date submitted</th>
                    <th>Total costs</th>
                    <th>Total effort</th>
                </tr>
                </thead>
                <tbody>
                {versionsQuery.data?.versions
                    .filter((version) => !version.isLatestVersionAndIsFPP)
                    .map((version, index) => (
                        <tr key={version.id}>
                            <td><small className="text-muted">{index + 1}</small></td>
                            <td>{version.type.description}</td>
                            <td>{version.status.status}</td>
                            <td><DateFormat>{version.dateSubmitted}</DateFormat></td>
                            <td><CostsFormat>{version.costs}</CostsFormat></td>
                            <td><EffortFormat>{version.effort}</EffortFormat></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Suspense fallback={<QueryState isLoading isError={false} loadingMessage="Loading project partners..."/>}>
                <PartnerTableWithCharts project={project}/>
            </Suspense>
        </>
    );
}
