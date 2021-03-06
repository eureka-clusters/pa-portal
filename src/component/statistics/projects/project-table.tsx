import React, { useEffect, FC } from 'react';
import {Link} from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DataTable, { TableColumn } from 'component/database-table/index';
import { CostsFormat, EffortFormat } from 'function/utils';

import { getFilter } from 'function/api';
import { useProjects, apiStates, ApiError } from 'hooks/api/statistics/projects/useProjects';

import {Project} from "interface/project";
import useState from 'react-usestateref';
import { useAuth } from "context/user-context";
import downloadBase64File from "function/DownloadBase64";
import { GetServerUri, objToQueryString } from 'function/api';
import moment from 'moment';
import LoadingButton from "component/partial/loading-button";

interface Props {
    filter: any,
}

const ProjectTable: FC<Props> = ({ filter }) => {

    let auth = useAuth();

    const [perPage, setPerPage] = useState(30); // default pageSize
    const [loading, setLoading] = useState(false);

    const [sort, setSort, sort_ref] = useState('project.name'); // default sort
    const [order, setOrder, order_ref] = useState('asc'); // default order

    // store the current page (needed for handleSort)
    const [currentPage, setCurrentPage] = useState(1); // default current page

    const { 
        state,
        error,
        projects,
        load,
        // pageCount,
        pageSize,
        // page,
        totalItems
    } = useProjects({filter: getFilter(filter), page: 1, pageSize: perPage, sort: sort, order: order});
    
    const [isExportLoading, setIsExportButtonLoading] = useState(false);
    

    const handlePageChange = async (newpage: number = 1) => {
        setCurrentPage(newpage);
    }

    //@johan i wanted to get rid of this "any" for column and use the exported TableColumn interface from datatable but it doesn't work. any idea?
    // const handleSort = async (column: TableColumn, sortDirection: string) => {
    const handleSort = async (column: any, sortDirection: string) => {
        setSort(column.sortField);
        setOrder(sortDirection);
    };

    const handlePerRowsChange = async (perPage: number, page: number) => {
        setPerPage(perPage);
    };

    const loadAsync = async () => {
        setLoading(true);
        await load({
            filter: getFilter(filter),
            page: currentPage,
            pageSize: perPage,
            sort,
            order
        });
        setLoading(false);
    };

    useEffect(() => {
        loadAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, perPage, sort, order]);



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
        var serverUri = GetServerUri();
        let jwtToken = auth.getJwtToken();

        const queryString = objToQueryString({
            filter: getFilter(filter),
            sort: sort,
            order: order,
        });

        await fetch(serverUri + '/api/statistics/results/project/download/csv?' + queryString,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                }
            }
        )
        .then(res => {
            if (!res.ok) { throw res }
            return res.json() 
        })
        .then((res) => {
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
            name: 'Total Costs (???)',
            selector: (project: Project) => project.latestVersionTotalCosts,
            format: (project: Project) => <CostsFormat value={project.latestVersionTotalCosts} showSuffix={false} showPrefix={false}/>,
            sortable: true,
            sortField: 'project.latestVersionTotalCosts',
            right:true,
            // compact: true,
        },
        {
            id: 'project.latestVersionTotalEffort',
            name: 'Total Effort (PY)',
            selector: (project: Project) => project.latestVersionTotalEffort,
            format: (project: Project) => <EffortFormat value={project.latestVersionTotalEffort} showSuffix={false} showPrefix={false}/>,
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
            grow:2,
            omit: true,  // currently ommited because of not enough space left.
        },
    ];

    

    switch (state) {
        case apiStates.ERROR:
            return (
                <>
                    <ApiError error={error}/>
                    <br/><br/>Filter used <code className={'pb-2 text-muted'}>{getFilter(filter)}</code>
                    <code className={'pb-2 text-muted'}>{JSON.stringify(filter, undefined, 2)}</code>
                </>
            );
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <h2>Projects</h2>
                    {/* <pre className='debug'>{JSON.stringify(filter, undefined, 2)}</pre> */}
                    {/* <pre className='debug'>{JSON.stringify(projects, undefined, 2)}</pre> */}
                    
                    <DataTable
                        // title="Projects"
                        keyField="project.slug"
                        columns={columns}
                        data={projects}

                        defaultSortFieldId={sort_ref.current}
                        defaultSortAsc={order_ref.current === 'asc' ? true : false}
                        // paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100, 200]}
                        progressPending={loading}
                        pagination

                        paginationServer
                        paginationPerPage={pageSize}
                        paginationTotalRows={totalItems}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                        sortServer
                        onSort={handleSort}
                    />

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