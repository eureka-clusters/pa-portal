import {getProjects} from '@/hooks/project/get-projects';
import React, {useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useGetFilterOptions} from '@/functions/filter-functions';
import {Project} from '@/interface/project';
import SortableTableHeader from '@/component/partial/sortable-table-header';
import {CostsFormat, EffortFormat} from "@/functions/utils";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {AxiosContext} from "@/providers/axios-provider";
import {Button} from "react-bootstrap";

// Then, use it in a component.
export default function Projects() {

    const queryClient = useQueryClient();
    const filterOptions = useGetFilterOptions();
    const authAxios = useContext(AxiosContext).authAxios;
    const [page, setPage] = React.useState(1)


    const {status, data, error, isFetching, isPreviousData} = useQuery({
        queryKey: ['projects', filterOptions, page],
        keepPreviousData: false,
        queryFn: () => getProjects({authAxios, filterOptions, page})
    });

    useEffect(() => {
        if (!isPreviousData && data?.nextPage) {
            queryClient.prefetchQuery({
                queryKey: ['projects', filterOptions, page + 1],
                queryFn: () => getProjects({authAxios, filterOptions, page: page + 1}),
            })
        }
    }, [data, isPreviousData, page, queryClient])

    return (
        <React.Fragment>
            {status === 'loading' ? (
                <div>Loading...</div>
            ) : status === 'error' ? (
                <div>Something went wrong</div>
            ) : (
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th><SortableTableHeader order='number'
                                                 filterOptions={filterOptions}>Number</SortableTableHeader>
                        </th>
                        <th><SortableTableHeader order='name'
                                                 filterOptions={filterOptions}>Project</SortableTableHeader>
                        </th>
                        <th><SortableTableHeader order='primary_cluster' filterOptions={filterOptions}>Primary
                            Cluster</SortableTableHeader></th>
                        <th><SortableTableHeader order='secondary_cluster' filterOptions={filterOptions}>Secondary
                            Cluster</SortableTableHeader></th>
                        <th><SortableTableHeader order='programme'
                                                 filterOptions={filterOptions}>Programme</SortableTableHeader>
                        </th><th><SortableTableHeader order='programme_call'
                                                 filterOptions={filterOptions}>Programme Call</SortableTableHeader>
                        </th><th><SortableTableHeader order='status'
                                                 filterOptions={filterOptions}>Status</SortableTableHeader>
                        </th>
                        <th><SortableTableHeader order='latest_version_effort' filterOptions={filterOptions}>Effort
                            (latest
                            version)</SortableTableHeader></th>
                        <th><SortableTableHeader order='latest_version_costs' filterOptions={filterOptions}>Costs
                            (latest
                            version)</SortableTableHeader></th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.projects?.map(
                        (project: Project, key: number) => (
                            <tr key={key}>
                                <td><small className="text-muted">{project.number}</small></td>
                                <td><Link to={`/projects/${project.slug}`}>{project.name}</Link></td>
                                <td>{project.primaryCluster.name}</td>
                                <td>{project.secondaryCluster?.name}</td>
                                <td>{project.programme}</td>
                                <td>{project.programmeCall}</td>
                                <td>{project.status.status}</td>
                                <td><EffortFormat>{project.latestVersionTotalEffort}</EffortFormat></td>
                                <td><CostsFormat>{project.latestVersionTotalCosts}</CostsFormat></td>
                            </tr>
                        )
                    )}
                    </tbody>
                </table>
            )}
            <div>Current Page: {page}</div>
            <Button variant={'primary'}
                    onClick={() => setPage((old) => Math.max(old - 1, 0))}
                    disabled={page === 1}
            >
                Previous Page
            </Button>
            {' '}
            <Button variant={'primary'}
                    onClick={() => {
                        setPage((old) => (data?.nextPage ? old + 1 : old))
                    }}
                    disabled={isPreviousData || !data?.nextPage}
            >
                Next Page
            </Button>
            {
                // Since the last page's data potentially sticks around between page requests,
                // we can use `isFetching` to show a background loading
                // indicator since our `status === 'loading'` state won't be triggered
                isFetching ? <span> Loading...</span> : null
            }
        </React.Fragment>
    );
}