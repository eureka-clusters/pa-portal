import React, {FC, useContext} from 'react';
import {Partner} from "@/interface/project/partner";
import SortableTableHeader from "@/component/partial/sortable-table-header";
import {Link} from "react-router-dom";
import PaginationLinks from "@/component/partial/pagination-links";
import {useGetFilterOptions} from "@/functions/filter-functions";
import {getPartners} from "@/hooks/partner/get-partners";
import {Project} from "@/interface/project";
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery} from "@tanstack/react-query";
import {CostsFormat, EffortFormat} from "@/functions/utils";

interface Props {
    project: Project
}

const PartnerTable: FC<Props> = ({project}) => {

    const filterOptions = useGetFilterOptions();
    const authAxios = useContext(AxiosContext).authAxios;

    const {isLoading, isError, data} = useQuery({
        queryKey: ['projectPartners', filterOptions, project],
        keepPreviousData: true,
        queryFn: () => getPartners({authAxios, filterOptions, project})
    });

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <React.Fragment>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th><SortableTableHeader sort='name' filterOptions={filterOptions}>Name</SortableTableHeader></th>
                    <th><SortableTableHeader sort='country' filterOptions={filterOptions}>Country</SortableTableHeader>
                    </th>
                    <th><SortableTableHeader sort='type' filterOptions={filterOptions}>Type</SortableTableHeader></th>
                    <th><SortableTableHeader sort='latestVersionCosts' filterOptions={filterOptions}>Latest version
                        costs</SortableTableHeader></th>
                    <th><SortableTableHeader sort='latestVersionEffort' filterOptions={filterOptions}>Latest version
                        effort</SortableTableHeader></th>
                </tr>
                </thead>
                <tbody>
                {data?.partners.map(
                    (partner: Partner, key: number) => (
                        <tr key={key}>
                            <td><Link to={`/projects/partner/${partner.slug}`}>{partner.organisation.name}</Link>
                            </td>
                            <td>{partner.organisation.country.country}</td>
                            <td>{partner.organisation.type.type}</td>
                            <td><CostsFormat>{partner.latestVersionCosts}</CostsFormat></td>
                            <td><EffortFormat>{partner.latestVersionEffort}</EffortFormat></td>
                        </tr>
                    )
                )}
                </tbody>
            </table>

            <PaginationLinks data={data}/>
        </React.Fragment>
    );
}

export default PartnerTable;