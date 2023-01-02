import React, {FC, useEffect} from 'react';
import {Partner} from "@/interface/project/partner";
import SortableTableHeader from "@/component/partial/sortable-table-header";
import {Link} from "react-router-dom";
import PaginationLinks from "@/component/partial/pagination-links";
import {useQuery} from "@/functions/filter-functions";
import {useGetPartners} from "@/hooks/partner/use-get-partners";
import {Project} from "@/interface/project";

interface Props {
    project: Project
}

const PartnerTable: FC<Props> = ({project}) => {

    const filterOptions = useQuery();
    const {state, setLocalFilterOptions} = useGetPartners({filterOptions: filterOptions, project: project});

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
                    <th>#</th>
                    <th><SortableTableHeader sort='name' filterOptions={filterOptions}>Name</SortableTableHeader></th>
                    <th><SortableTableHeader sort='country' filterOptions={filterOptions}>Country</SortableTableHeader>
                    </th>
                    <th><SortableTableHeader sort='type' filterOptions={filterOptions}>Type</SortableTableHeader></th>
                    <th><SortableTableHeader sort='latestVersionCosts' filterOptions={filterOptions}>Latest version costs</SortableTableHeader></th>
                    <th><SortableTableHeader sort='latestVersionEffort' filterOptions={filterOptions}>Latest version effort</SortableTableHeader></th>
                </tr>
                </thead>
                <tbody>
                {state.data.items && state.data.items.map(
                    (partner: Partner, key: number) => (
                        <tr key={partner.id}>
                            <td><small className="text-muted">{key}</small></td>
                            <td><Link to={`/projects/partner/${partner.slug}`}>{partner.organisation.name}</Link>
                            </td>
                            <td>{partner.organisation.country.country}</td>
                            <td>{partner.organisation.type.type}</td>
                            <td>{partner.latestVersionCosts}</td>
                            <td>{partner.latestVersionEffort}</td>
                        </tr>
                    )
                )}
                </tbody>
            </table>

            <PaginationLinks state={state} setPage={setPage}/>
        </React.Fragment>
    );
}

export default PartnerTable;