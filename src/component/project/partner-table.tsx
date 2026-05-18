import {Partner} from "@/interface/project/partner";
import SortableTableHeader from "@/component/partial/sortable-table-header";
import {Link} from "react-router-dom";
import {useGetFilterOptions} from "@/functions/filter-functions";
import {getPartners} from "@/hooks/partner/get-partners";
import {Project} from "@/interface/project";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {CostsFormat, EffortFormat} from "@/functions/utils";
import {QueryState} from "@/component/partial/query-state";
import {useAxios} from "@/providers/axios-provider";

interface PartnerTableProps {
    project: Project,
}

const PartnerTable = ({project}: PartnerTableProps) => {

    const filterOptions = useGetFilterOptions();
    const {authAxios} = useAxios();

    const {isLoading, isError, data} = useQuery({
        queryKey: ['projectPartners', filterOptions, project],
        placeholderData: keepPreviousData,
        queryFn: () => getPartners({
            authAxios, filterOptions, project, paginationOptions: {
                pageIndex: 0,
                pageSize: 1000,
            }
        })
    });

    if (isLoading || isError) {
        return (
            <QueryState
                isLoading={isLoading}
                isError={isError}
                errorMessage="The project partners could not be loaded."
            />
        );
    }

    if (!data) {
        return <div>No partner data is available.</div>;
    }

    return (
        <>
            <table className="table table-striped table-sm">
                <thead>
                <tr>
                    <th colSpan={5}></th>
                    <th colSpan={2} className={'text-end'}>Project Outline</th>
                    <th colSpan={2} className={'text-end'}>Full Project Proposal</th>
                    {!project.latestVersion.isLatestVersionAndIsFPP &&
                        <th colSpan={2} className={'text-end'}>Latest version</th>
                    }

                </tr>
                <tr>
                    <th colSpan={2}><SortableTableHeader order='name'
                                                         filterOptions={filterOptions}>Name</SortableTableHeader></th>
                    <th>Coordinator</th>
                    <th><SortableTableHeader order='country' filterOptions={filterOptions}>Country</SortableTableHeader>
                    </th>
                    <th><SortableTableHeader order='type' filterOptions={filterOptions}>Type</SortableTableHeader></th>
                    <th className={'text-end'}><SortableTableHeader order='projectOutlineCosts'
                                                                    filterOptions={filterOptions}>Costs</SortableTableHeader>
                    </th>
                    <th className={'text-end'}><SortableTableHeader order='projectOutlineEffort'
                                                                    filterOptions={filterOptions}>Effort</SortableTableHeader>
                    </th>
                    <th className={'text-end'}><SortableTableHeader order='fullProjectProposalCosts'
                                                                    filterOptions={filterOptions}>Costs</SortableTableHeader>
                    </th>
                    <th className={'text-end'}><SortableTableHeader order='fullProjectProposalCosts'
                                                                    filterOptions={filterOptions}>Effort</SortableTableHeader>
                    </th>
                    {!project.latestVersion.isLatestVersionAndIsFPP && <>
                        <th className={'text-end'}><SortableTableHeader order='latestVersionCosts'
                                                                        filterOptions={filterOptions}>Costs</SortableTableHeader>
                        </th>
                        <th className={'text-end'}><SortableTableHeader order='latestVersionEffort'
                                                                        filterOptions={filterOptions}>Effort</SortableTableHeader>
                        </th>
                    </>}
                </tr>
                </thead>
                <tfoot>
                <tr>
                    <td colSpan={11}><small className={'text-muted'}>Cost figures are in k&euro;, effort figures in PY.
                        The latest version is the most recent active versions. This can be the Full Project Proposal but
                        could also be a Change Request. Inactive partners which are still active in the Full Project
                        Proposal or Latest version
                        will be removed in an upcoming Change Request</small></td>
                </tr>
                </tfoot>
                <tbody>
                {data?.partners.map(
                    (partner: Partner, index: number) => (
                        <tr key={partner.id}>
                            <td><small className={'text-muted'}>{index + 1}</small></td>
                            <td>
                                <Link to={`/project/partner/${partner.slug}`}>{partner.organisation.name}</Link>
                                {!partner.isActive && <span className={'badge bg-danger ms-2'}>Inactive</span>}
                            </td>
                            <td>{partner.isCoordinator ? 'Yes' : ''}</td>
                            <td>{partner.organisation.country.country}</td>
                            <td>{partner.organisation.type.type}</td>
                            <td className={'text-end'}><CostsFormat>{partner.projectOutlineCosts}</CostsFormat></td>
                            <td className={'text-end'}><EffortFormat>{partner.projectOutlineEffort}</EffortFormat></td>
                            <td className={'text-end'}><CostsFormat>{partner.fullProjectProposalCosts}</CostsFormat>
                            </td>
                            <td className={'text-end'}><EffortFormat>{partner.fullProjectProposalEffort}</EffortFormat>
                            </td>
                            {!project.latestVersion.isLatestVersionAndIsFPP && <>
                                <td className={'text-end'}><CostsFormat>{partner.latestVersionCosts}</CostsFormat></td>
                                <td className={'text-end'}><EffortFormat>{partner.latestVersionEffort}</EffortFormat>
                                </td>
                            </>}
                        </tr>
                    )
                )}
                </tbody>
            </table>


        </>
    );
}

export default PartnerTable;
