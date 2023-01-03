import React, {useContext, useEffect, useState} from 'react';
import {createSearchParams, Link} from "react-router-dom";
import {useGetProjects} from "@/hooks/project/use-get-projects";
import {Project} from "@/interface/project";
import downloadBase64File from "@/functions/download-base64";
import LoadingButton from "@/component/partial/loading-button";
import {FilterValues} from "@/interface/statistics/filter-values";
import {useQuery} from '@/functions/filter-functions';
import SortableTableHeader from "@/component/partial/sortable-table-header";
import PaginationLinks from "@/component/partial/pagination-links";
import {AxiosContext} from "@/providers/axios-provider";

const ProjectTable = ({filter}: { filter: FilterValues }) => {

    const filterOptions = useQuery();
    const axiosContext = useContext(AxiosContext);

    const {state, setLocalFilterOptions} = useGetProjects({filterOptions});
    const [isExportLoading, setIsExportButtonLoading] = useState(false);

    useEffect(() => {

        //Add the filter (bzipped) to the filterOptions
        filterOptions.filter = btoa(JSON.stringify(filter));

        setLocalFilterOptions({...filterOptions, filter: btoa(JSON.stringify(filter))});

    }, [filterOptions, filter]);

    function setPage(page: string) {
        setLocalFilterOptions({...filterOptions, page});
    }


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


    return (
        <React.Fragment>
            <h2>Projects</h2>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>#</th>
                    <th><SortableTableHeader sort='name' filterOptions={filterOptions}>Project</SortableTableHeader>
                    </th>
                    <th><SortableTableHeader sort='primary_cluster' filterOptions={filterOptions}>Primary
                        Cluster</SortableTableHeader></th>
                    <th><SortableTableHeader sort='secondary_cluster' filterOptions={filterOptions}>Secondary
                        Cluster</SortableTableHeader></th>
                    <th><SortableTableHeader sort='status' filterOptions={filterOptions}>Status</SortableTableHeader>
                    </th>
                </tr>
                </thead>
                <tbody>
                {state.data.items && state.data.items.map(
                    (project: Project, key: number) => (
                        <tr key={project.number}>
                            <td><small className="text-muted">{key}</small></td>
                            <td><Link to={`/projects/${project.slug}`}>{project.name}</Link></td>
                            <td>{project.primaryCluster.name}</td>
                            <td>{project.secondaryCluster?.name}</td>
                            <td>{project.status.status}</td>
                        </tr>
                    )
                )}
                </tbody>
            </table>

            <PaginationLinks state={state} setPage={setPage}/>

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