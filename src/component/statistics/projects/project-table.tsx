import React, {useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {getProjects} from "@/hooks/project/get-projects";
import {Project} from "@/interface/project";
import downloadBase64File from "@/functions/download-base64";
import LoadingButton from "@/component/partial/loading-button";
import {FilterValues} from "@/interface/statistics/filter-values";
import {useGetFilterOptions} from '@/functions/filter-functions';
import SortableTableHeader from "@/component/partial/sortable-table-header";
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {CostsFormat, EffortFormat} from "@/functions/utils";
import {Button} from "react-bootstrap";

const ProjectTable = ({filterValues}: { filterValues: FilterValues }) => {

    const queryClient = useQueryClient();
    const filterOptions = useGetFilterOptions();
    const axiosContext = useContext(AxiosContext);
    const [isExportLoading, setIsExportButtonLoading] = useState(false);
    const authAxios = useContext(AxiosContext).authAxios;
    const [page, setPage] = React.useState(1)

    const {status, data, isFetching, isPreviousData} = useQuery({
        queryKey: ['projectStatistics', filterOptions, filterValues, page],
        keepPreviousData: false,
        queryFn: () => getProjects({authAxios, filterOptions, filterValues, page})
    });

    useEffect(() => {
        if (!isPreviousData && data?.nextPage) {
            queryClient.prefetchQuery({
                queryKey: ['projectStatistics', filterOptions, filterValues, page + 1],
                queryFn: () => getProjects({authAxios, filterOptions, filterValues, page: page + 1}),
            })
        }
    }, [data, isPreviousData, page, queryClient])

    useEffect(() => {
        if (isExportLoading) {
            // start the download
            (async () => {
                await downloadExcel().then(() => {
                    setIsExportButtonLoading(false);
                });
            })();
        }
        // downloadExcel couldn't been added
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExportLoading]);


    const downloadExcel = async () => {
        await axiosContext.authAxios.get('/statistics/results/project/download/' + filterOptions.filter)
            .then((res: any) => {
                let extension = res.data.extension;
                let mimetype = res.data.mimetype;
                downloadBase64File(mimetype, res.data.download, 'Download' + extension);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    return (
        <React.Fragment>
            {status === 'loading' ? (
                <div>Loading...</div>
            ) : status === 'error' ? (
                <div>Something went wrong</div>
            ) : (
                <React.Fragment>
                    <h2>Projects</h2>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th><SortableTableHeader order='name'
                                                     filterOptions={filterOptions}>Project</SortableTableHeader>
                            </th>
                            <th><SortableTableHeader order='primary_cluster' filterOptions={filterOptions}>Primary
                                Cluster</SortableTableHeader></th>
                            <th><SortableTableHeader order='secondary_cluster' filterOptions={filterOptions}>Secondary
                                Cluster</SortableTableHeader></th>
                            <th><SortableTableHeader order='programme'
                                                     filterOptions={filterOptions}>Programme</SortableTableHeader>
                            </th>
                            <th><SortableTableHeader order='programme_call'
                                                     filterOptions={filterOptions}>Programme Call</SortableTableHeader>
                            </th>
                            <th><SortableTableHeader order='status'
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

                    <div className="datatable-download">
                        <LoadingButton
                            isLoading={isExportLoading}
                            loadingText='Exporting...'
                            onClick={() => setIsExportButtonLoading(true)}
                        >
                            Export to Excel
                        </LoadingButton>
                    </div>


                </React.Fragment>
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

export default ProjectTable;