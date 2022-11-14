import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {CostsFormat, EffortFormat} from 'function/utils';
import {useProjects} from 'hooks/api/statistics/projects/use-projects';
import {ApiStates, RenderApiError} from "hooks/api/api-error";
import {Project} from "interface/project";
import downloadBase64File from "function/download-base64";
import moment from 'moment';
import LoadingButton from "component/partial/loading-button";
import axios from "axios";
import {FilterValues} from "interface/statistics/filter-values";

const ProjectTable = ({filter}: { filter: FilterValues }) => {

    const [perPage, setPerPage] = useState(30); // default pageSize
    const [loading, setLoading] = useState(false);

    const [sort, setSort] = useState('project.name'); // default sort
    const [order, setOrder] = useState('asc'); // default order

    // store the current page (needed for handleSort)
    const [currentPage, setCurrentPage] = useState(1); // default current page

    const {
        state,
        error,
        projects,
        load,
        pageSize,
        totalItems
    } = useProjects(filter, 1, perPage, sort, order);

    const [isExportLoading, setIsExportButtonLoading] = useState(false);


    const handlePageChange = async (newpage: number = 1) => {
        setCurrentPage(newpage);
    }

    const handleSort = async (column: any, sortDirection: string) => {
        setSort(column.sortField);
        setOrder(sortDirection);
    };

    const handlePerRowsChange = async (perPage: number) => {
        setPerPage(perPage);
    };

    const loadAsync = async () => {
        await load();
    };

    useEffect(() => {
        setLoading(true);
        loadAsync().then(() => setLoading(false));
    }, [filter, currentPage, perPage, sort, order]);


    React.useEffect(() => {
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
        const queryString = btoa(JSON.stringify({
            filter: filter,
            sort: sort,
            order: order,
        }));

        await axios.create().get('/statistics/results/project/download/csv?' + queryString)
            .then((res: any) => {
                let extension = res.extension;
                let mimetype = res.mimetype;
                downloadBase64File(mimetype, res.download, 'Download' + extension);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const columns = [
        {
            id: 'project.slug',
            name: 'slug',
            selector: (row: Project) => row.slug,
            sortable: false,
            omit: true,
        },
        {
            id: 'project.number',
            name: 'Number',
            selector: (project: Project) => project.number,
            sortable: true,
            sortField: 'project.number',
            // compact: true,
        },
        {
            id: 'project.name',
            name: 'Name',
            selector: (project: Project) => project.name,
            format: (project: Project) => <Link to={`/project/${project.slug}`}
                                                title={project.name}>{project.name}</Link>,
            sortable: true,
            sortField: 'project.name',
            // compact: true,
            grow: 2,
        },
        {
            id: 'project.primaryCluster',
            name: 'Primary Cluster',
            selector: (project: Project) => project.primaryCluster ? project.primaryCluster.name : '',
            sortable: true,
            sortField: 'project.primaryCluster.name',
            // compact: true,
        },
        {
            id: 'project.secondaryCluster',
            name: 'Secondary Cluster',
            selector: (project: Project) => project.secondaryCluster ? project.secondaryCluster.name : '',
            sortable: true,
            sortField: 'project.secondaryCluster.name',
            // compact: true,
        },
        {
            id: 'project.status.status',
            name: 'Status',
            selector: (project: Project) => project.status ? project.status.status : '',
            sortable: true,
            sortField: 'project.status.status',
            // compact: true,
        },
        {
            id: 'project.latestVersion.type.type',
            name: 'Latest version',
            selector: (project: Project) => project.latestVersion && project.latestVersion.type ? project.latestVersion.type.type : '',
            sortable: true,
            sortField: 'project.latestVersion.type.type',
            // compact: true,
        },
        {
            id: 'project.latestVersionTotalCosts',
            name: 'Total Costs (€)',
            selector: (project: Project) => project.latestVersionTotalCosts,
            format: (project: Project) => <CostsFormat value={project.latestVersionTotalCosts} showSuffix={false}
                                                       showPrefix={false}/>,
            sortable: true,
            sortField: 'project.latestVersionTotalCosts',
            right: true,
            // compact: true,
        },
        {
            id: 'project.latestVersionTotalEffort',
            name: 'Total Effort (PY)',
            selector: (project: Project) => project.latestVersionTotalEffort,
            format: (project: Project) => <EffortFormat value={project.latestVersionTotalEffort} showSuffix={false}
                                                        showPrefix={false}/>,
            sortable: true,
            sortField: 'project.latestVersionTotalEffort',
            right: true,
            // compact: true,
        },
        {
            id: 'project.labelDate',
            name: 'Label Date',
            selector: (project: Project) => project.labelDate,
            format: (project: Project) => moment(project.labelDate).format('LLL'),
            sortable: false,
            sortField: 'project.labelDate',
            // compact: true,
            grow: 2,
            omit: true,  // currently ommited because of not enough space left.
        },
    ];


    switch (state) {
        case ApiStates.ERROR:
            return (
                <>
                    <RenderApiError error={error}/>
                    <br/><br/>Filter used <code className={'pb-2 text-muted'}>{JSON.stringify(filter)}</code>
                    <code className={'pb-2 text-muted'}>{JSON.stringify(filter, undefined, 2)}</code>
                </>
            );
        case ApiStates.SUCCESS:
            return (
                <React.Fragment>
                    <h2>Projects</h2>


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
        default:
            return <p>Loading data...</p>;
    }
}

export default ProjectTable;