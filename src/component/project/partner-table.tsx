import React, {FC, useContext} from 'react';
import {Partner} from "@/interface/project/partner";
import SortableTableHeader from "@/component/partial/sortable-table-header";
import {Link} from "react-router-dom";
import {useGetFilterOptions} from "@/functions/filter-functions";
import {getPartners} from "@/hooks/partner/get-partners";
import {Project} from "@/interface/project";
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery} from "@tanstack/react-query";
import {CostsFormat, EffortFormat} from "@/functions/utils";
import {Version} from "@/interface/project/version";

interface Props {
    project: Project,
    activeVersion?: Version
}

const PartnerTable: FC<Props> = ({project, activeVersion}) => {

    const filterOptions = useGetFilterOptions();
    const authAxios = useContext(AxiosContext).authAxios;

    const {isLoading, data} = useQuery({
        queryKey: ['projectPartners', filterOptions, activeVersion, project],
        keepPreviousData: true,
        queryFn: () => getPartners({
            authAxios, filterOptions, project, activeVersion, paginationOptions: {
                pageIndex: 0,
                pageSize: 1000,
            }
        })
    });

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <React.Fragment>
            <table className="table table-striped table-sm">
                <thead>
                <tr>
                    <th colSpan={2}><SortableTableHeader order='name' filterOptions={filterOptions}>Name</SortableTableHeader></th>
                    <th>Coordinator</th>
                    <th><SortableTableHeader order='country' filterOptions={filterOptions}>Country</SortableTableHeader>
                    </th>
                    <th><SortableTableHeader order='type' filterOptions={filterOptions}>Type</SortableTableHeader></th>
                    <th><SortableTableHeader order='latestVersionCosts' filterOptions={filterOptions}>Latest version
                        costs</SortableTableHeader></th>
                    <th><SortableTableHeader order='latestVersionEffort' filterOptions={filterOptions}>Latest version
                        effort</SortableTableHeader></th>
                </tr>
                </thead>
                <tbody>
                {data?.partners.map(
                    (partner: Partner, key: number) => (
                        <tr key={key}>
                            <td><small className={'text-muted'}>{key+1}</small></td>
                            <td><Link to={`/project/partner/${partner.slug}`}>{partner.organisation.name}</Link></td>
                            <td>{partner.isCoordinator ? 'Yes' : ''}</td>
                            <td>{partner.organisation.country.country}</td>
                            <td>{partner.organisation.type.type}</td>
                            <td><CostsFormat>{partner.latestVersionCosts}</CostsFormat></td>
                            <td><EffortFormat>{partner.latestVersionEffort}</EffortFormat></td>
                        </tr>
                    )
                )}
                </tbody>
            </table>


        </React.Fragment>
    );
}

export default PartnerTable;