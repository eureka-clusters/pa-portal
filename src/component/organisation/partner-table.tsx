import React, {FC, useContext} from 'react';
import {Link} from "react-router-dom";
import {Partner} from "@/interface/project/partner";
import {Organisation} from "@/interface/organisation";
import {getPartners} from "@/hooks/partner/get-partners";
import {useGetFilterOptions} from '@/functions/filter-functions';
import {AxiosContext} from "@/providers/axios-provider";
import SortableTableHeader from '@/component/partial/sortable-table-header';
import {useQuery} from "@tanstack/react-query";

interface Props {
    organisation: Organisation
}

const PartnerTable: FC<Props> = ({organisation}) => {

    const filterOptions = useGetFilterOptions();

    const authAxios = useContext(AxiosContext).authAxios;

    const {isLoading, isError, data} = useQuery({
        queryKey: ['partner_projects', organisation, filterOptions],
        keepPreviousData: true,
        queryFn: () => getPartners({
            authAxios, filterOptions, organisation, paginationOptions: {
                pageIndex: 0,
                pageSize: 1000
            }
        })
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    return (
        <React.Fragment>
            <h2>Partners</h2>

            <table className="table table-striped table-sm">
                <thead>
                <tr>
                    <th><SortableTableHeader order='name' filterOptions={filterOptions}>Name</SortableTableHeader></th>
                    <th><SortableTableHeader order='country' filterOptions={filterOptions}>Country</SortableTableHeader>
                    </th>
                    <th><SortableTableHeader order='project' filterOptions={filterOptions}>Project</SortableTableHeader>
                    </th>
                    <th><SortableTableHeader order='type' filterOptions={filterOptions}>Type</SortableTableHeader></th>
                </tr>
                </thead>
                <tbody>
                {data?.partners.map(
                    (partner: Partner, key: number) => (
                        <tr key={partner.id}>
                            <td><Link
                                to={`/project/partner/${partner.slug}`}>{partner.organisation.name}</Link>
                            </td>
                            <td>{partner.organisation.country.country}</td>
                            <td><Link to={`/project/${partner.project.slug}`}>{partner.project.name}</Link></td>
                            <td>{partner.organisation.type.type}</td>
                        </tr>
                    )
                )}
                </tbody>
            </table>
        </React.Fragment>
    );
}

export default PartnerTable;