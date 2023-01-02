import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Organisation} from "@/interface/organisation";
import {useGetOrganisations} from "@/hooks/organisation/use-get-organisations";
import {useQuery} from '@/functions/filter-functions';
import SortableTableHeader from '@/component/partial/sortable-table-header';

export default function Organisations() {

    const filterOptions = useQuery();

    const {state, setLocalFilterOptions} = useGetOrganisations({filterOptions});

    useEffect(() => {
        setLocalFilterOptions(filterOptions);
    }, [filterOptions]);

    if (state.isLoading) {
        return <p>Loading organisations...</p>;
    }

    return (
        <React.Fragment>
            <h1>Organisations</h1>

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>#</th>
                    <th><SortableTableHeader sort='name' filterOptions={filterOptions}>Name</SortableTableHeader></th>
                    <th><SortableTableHeader sort='country' filterOptions={filterOptions}>Country</SortableTableHeader>
                    </th>
                    <th><SortableTableHeader sort='type' filterOptions={filterOptions}>Type</SortableTableHeader></th>
                </tr>
                </thead>
                <tbody>
                {state.data._embedded.organisations.map(
                    (organisation: Organisation, key: number) => (
                        <tr key={organisation.id}>
                            <td><small className="text-muted">{key}</small></td>
                            <td><Link to={`/organisation/${organisation.slug}`}>{organisation.name}</Link></td>
                            <td>{organisation.country.country}</td>
                            <td>{organisation.type.type}</td>
                        </tr>
                    )
                )}
                </tbody>
            </table>

        </React.Fragment>

    );
}