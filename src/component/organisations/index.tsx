import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {Organisation} from "@/interface/organisation";
import {getOrganisations} from "@/hooks/organisation/get-organisations";
import {useGetFilterOptions} from '@/functions/filter-functions';
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery} from "@tanstack/react-query";
import SortableTableHeader from '@/component/partial/sortable-table-header';
import PaginationLinks from "@/component/partial/pagination-links";

export default function Organisations() {

    const filterOptions = useGetFilterOptions();
    filterOptions.pageSize = '100';

    const authAxios = useContext(AxiosContext).authAxios;

    const {isLoading, isError, data} = useQuery({
        queryKey: ['organisations', filterOptions],
        keepPreviousData: true,
        queryFn: () => getOrganisations({authAxios, filterOptions})
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error</div>;
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
                </tr>
                </thead>
                <tbody>
                {data.organisations?.map(
                    (organisation: Organisation, key: number) => (
                        <tr key={key}>
                            <td><Link to={`/organisations/${organisation.slug}`}>{organisation.name}</Link></td>
                            <td>{organisation.country.country}</td>
                            <td>{organisation.type.type}</td>
                        </tr>
                    )
                )}
                </tbody>
            </table>

            <PaginationLinks data={data}/>

        </React.Fragment>

    );
}