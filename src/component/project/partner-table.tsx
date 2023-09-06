import React, {useContext} from 'react';
import {Partner} from "@/interface/project/partner";
import SortableTableHeader from "@/component/partial/sortable-table-header";
import {Link} from "react-router-dom";
import {useGetFilterOptions} from "@/functions/filter-functions";
import {getPartners} from "@/hooks/partner/get-partners";
import {Project} from "@/interface/project";
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery} from "@tanstack/react-query";
import {CostsFormat, EffortFormat} from "@/functions/utils";

interface PartnerTableProps {
    project: Project,
}

const PartnerTable = ({project}: PartnerTableProps) => {

    const filterOptions = useGetFilterOptions();
    const authAxios = useContext(AxiosContext).authAxios;

    const {isLoading, data} = useQuery({
        queryKey: ['projectPartners', filterOptions, project],
        keepPreviousData: true,
        queryFn: () => getPartners({
            authAxios, filterOptions, project, paginationOptions: {
                pageIndex: 0,
                pageSize: 1000,
            }
        })
    });

    if (isLoading) {
        return <div>Loading...</div>
    }

    console.log();

    return (
        <React.Fragment>
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
                    (partner: Partner, key: number) => (
                        <tr key={key}>
                            <td><small className={'text-muted'}>{key + 1}</small></td>
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


        </React.Fragment>
    );
}

export default PartnerTable;