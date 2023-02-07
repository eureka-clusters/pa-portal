import React, {useContext, useEffect, useState} from 'react';
import {createSearchParams, Link} from "react-router-dom";
import {getProjects} from "@/hooks/project/get-projects";
import {Project} from "@/interface/project";
import downloadBase64File from "@/functions/download-base64";
import LoadingButton from "@/component/partial/loading-button";
import {FilterValues} from "@/interface/statistics/filter-values";
import {useGetFilterOptions} from '@/functions/filter-functions';
import SortableTableHeader from "@/component/partial/sortable-table-header";
import PaginationLinks from "@/component/partial/pagination-links";
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery} from "@tanstack/react-query";
import {CostsFormat, EffortFormat} from "@/functions/utils";

const ProjectTable = ({filterValues}: { filterValues: FilterValues }) => {

    const filterOptions = useGetFilterOptions();
    const axiosContext = useContext(AxiosContext);

    const [isExportLoading, setIsExportButtonLoading] = useState(false);

    const authAxios = useContext(AxiosContext).authAxios;

    const {isLoading, isError, data} = useQuery({
        queryKey: ['projectStatistics', filterOptions, filterValues],
        keepPreviousData: true,
        queryFn: () => getProjects({authAxios, filterOptions, filterValues})
    });


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
        await axiosContext.authAxios.get('/statistics/results/project/download/csv?' + createSearchParams(filterOptions))
            .then((res: any) => {
                let extension = res.data.extension;
                let mimetype = res.data.mimetype;
                downloadBase64File(mimetype, res.data.download, 'Download' + extension);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }


    return (
        <React.Fragment>
            <h2>Projects</h2>
            <table className="table table-striped">
                <thead>
                <tr>
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
                {data.projects?.map(
                    (project: Project, key: number) => (
                        <tr key={project.number}>
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

            <PaginationLinks data={data}/>

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
    );
}

export default ProjectTable;