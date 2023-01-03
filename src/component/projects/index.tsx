import {useGetProjects} from '@/hooks/project/use-get-projects';
import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useQuery} from '@/functions/filter-functions';
import {Project} from '@/interface/project';
import SortableTableHeader from '@/component/partial/sortable-table-header';
import PaginationLinks from "@/component/partial/pagination-links";
import {CostsFormat, EffortFormat} from "@/functions/utils";

// Then, use it in a component.
export default function Projects() {

    const filterOptions = useQuery();

    const {state, setLocalFilterOptions} = useGetProjects({filterOptions});

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
                    <th><SortableTableHeader sort='number' filterOptions={filterOptions}>Number</SortableTableHeader></th>
                    <th><SortableTableHeader sort='name' filterOptions={filterOptions}>Project</SortableTableHeader>
                    </th>
                    <th><SortableTableHeader sort='primary_cluster' filterOptions={filterOptions}>Primary
                        Cluster</SortableTableHeader></th>
                    <th><SortableTableHeader sort='secondary_cluster' filterOptions={filterOptions}>Secondary
                        Cluster</SortableTableHeader></th>
                    <th><SortableTableHeader sort='status' filterOptions={filterOptions}>Status</SortableTableHeader>
                    </th>
                    <th><SortableTableHeader sort='latest_version_effort' filterOptions={filterOptions}>Effort (latest
                        version)</SortableTableHeader></th>
                    <th><SortableTableHeader sort='latest_version_costs' filterOptions={filterOptions}>Costs (latest
                        version)</SortableTableHeader></th>
                </tr>
                </thead>
                <tbody>
                {state.data.items && state.data.items.map(
                    (project: Project, key: number) => (
                        <tr key={key}>
                            <td><small className="text-muted">{project.number}</small></td>
                            <td><Link to={`/projects/${project.slug}`}>{project.name}</Link></td>
                            <td>{project.primaryCluster.name}</td>
                            <td>{project.secondaryCluster?.name}</td>
                            <td>{project.status.status}</td>
                            <td><EffortFormat>{project.latestVersionTotalEffort}</EffortFormat></td>
                            <td><CostsFormat>{project.latestVersionTotalCosts}</CostsFormat></td>
                        </tr>
                    )
                )}
                </tbody>
            </table>

            <PaginationLinks state={state} setPage={setPage}/>

        </React.Fragment>
    );
}
