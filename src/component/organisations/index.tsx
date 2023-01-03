import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Organisation} from "@/interface/organisation";
import {useGetOrganisations} from "@/hooks/organisation/use-get-organisations";
import {useQuery} from '@/functions/filter-functions';
import SortableTableHeader from '@/component/partial/sortable-table-header';
import PaginationLinks from "@/component/partial/pagination-links";

export default function Organisations() {

    const filterOptions = useQuery();

    const {state, setLocalFilterOptions} = useGetOrganisations({filterOptions});

    useEffect(() => {
        setLocalFilterOptions(filterOptions);
    }, [filterOptions]);

    function setPage(page: string) {
        setLocalFilterOptions({...filterOptions, page});
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
                {state.data.items && state.data.items.map(
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

            <PaginationLinks state={state} setPage={setPage}/>

        </React.Fragment>

    );
}