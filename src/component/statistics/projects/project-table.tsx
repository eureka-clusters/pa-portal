import React, {FC} from 'react';


import {Link} from "react-router-dom";
import DataTable from 'component/database-table/index';
import { CostsFormat, EffortFormat } from 'function/utils';

import { getFilter } from 'function/api';
import { useProjects, apiStates, ApiError } from 'hooks/api/statistics/projects/useProjects'; // new api


import {Project} from "interface/project";
import useState from 'react-usestateref';
import { useAuth } from "context/user-context";
import downloadBase64File from "function/DownloadBase64";
import { GetServerUri, objToQueryString } from 'function/api';

import { __delay__ } from 'function/utils';
import LoadingButton from "component/partial/loading-button";

interface Props {
    filter: any,
}

const ProjectTable: FC<Props> = ({ filter }) => {

    let auth = useAuth();

    const [perPage, setPerPage] = useState(30); // default pageSize
    const [loading, setLoading] = useState(false);

    const [sort, setSort, sort_ref] = useState('partner.organisation.name'); // default sort
    const [order, setOrder, order_ref] = useState('asc'); // default order

    // store the current page (needed for handleSort)
    const [currentPage, setCurrentPage] = useState(1); // default current page

    // const { state, error, projects, load, pageCount, pageSize, page, totalItems } = GetResults({ filter: getFilter(filter), page: 1, pageSize: perPage }); // old api
    const { state, error, projects, load, pageCount, pageSize, page, totalItems } = useProjects({ filter: getFilter(filter), page: 1, pageSize: perPage }); // new api


    const [isExportLoading, setIsExportButtonLoading] = useState(false);
    

    const handlePageChange = async (newpage: number = 1) => {
        setCurrentPage(newpage);
        setLoading(true);
        await load({
            filter: getFilter(filter),
            page: newpage,
            pageSize: perPage,
            sort: sort_ref.current,
            order: order_ref.current
        });
        setLoading(false);
    };

    const handlePerRowsChange = async (perPage: any, page: any) => {
        setLoading(true);
        await load({
            filter: getFilter(filter),
            page: page,
            pageSize: perPage,
            sort: sort,
            order: order
        });
        setPerPage(perPage);
        setLoading(false);
    };

    const handleSort = async (column: any, sortDirection: any) => {
        let sortField = column.sortField;
        setSort(sortField);
        setOrder(sortDirection);
        if (currentPage === 1) {
            await load({
                filter: getFilter(filter),
                page: 1,
                pageSize: perPage,
                sort: sortField,
                order: sortDirection
            });
        }
    };

    React.useEffect(() => {
        if (isExportLoading) {
            // start the download
            (async () => {
                await __delay__(3000); // test delay to test if the download could be started twice
                await downloadExcel().then(() => {
                    setIsExportButtonLoading(false);
                });
            })();
        }
    }, [isExportLoading]);


    const downloadExcel = async () => {
        var serverUri = GetServerUri();
        let jwtToken = auth.getJwtToken();

        const queryString = objToQueryString({
            filter: getFilter(filter),
            sort: sort,
            order: order,
        });

        fetch(serverUri + '/api/statistics/results/project/download/csv?' + queryString,
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
            id: 'number',
            name: 'Number',
            selector: (project: Project) => project.number,
            sortable: true,
            sortField: 'project.number',
        },
        {
            id: 'name',
            name: 'Name',
            selector: (project: Project) => project.name,
            format: (project: Project) => <Link to={`/project/${project.slug}`}
                                                title={project.name}>{project.name}</Link>,
            sortable: true,
            sortField: 'project.name',
        },
        {
            id: 'primaryCluster',
            name: 'Primary Cluster',
            selector: (project: Project) => project.primaryCluster ? project.primaryCluster.name : '',
            sortable: true,
            sortField: 'project.primaryCluster.name',
        },
        {
            id: 'secondaryCluster',
            name: 'Secondary Cluster',
            selector: (project: Project) => project.secondaryCluster ? project.secondaryCluster.name : '',
            sortable: true,
            sortField: 'project.secondaryCluster.name',
        },
        {
            id: 'status',
            name: 'Status',
            selector: (project: Project) => project.status ? project.status.status : '',
            sortable: true,
            sortField: 'project.status.status',
        },
        {
            id: 'latestVersion',
            name: 'Latest version',
            selector: (project: Project) => project.latestVersion && project.latestVersion.type ? project.latestVersion.type.type : '',
            sortable: true,
            sortField: 'project.latestVersion.type.type',
        },
        {
            id: 'latestVersionTotalCosts',
            name: 'Total Costs',
            selector: (project: Project) => project.latestVersionTotalCosts,
            format: (project: Project) => <CostsFormat value={project.latestVersionTotalCosts}/>,
            sortable: true,
            sortField: 'project.latestVersionTotalCosts',
        },
        {
            id: 'latestVersionTotalEffort',
            name: 'Total Effort',
            selector: (project: Project) => project.latestVersionTotalEffort,
            format: (project: Project) => <EffortFormat value={project.latestVersionTotalEffort}/>,
            sortable: true,
            sortField: 'project.latestVersionTotalEffort',
        },
    ];

    

    switch (state) {
        case apiStates.ERROR:
            return (
                <>
                    <ApiError error={error}/>
                    <br/><br/>Filter used <code className={'pb-2 text-muted'}>{getFilter(filter)}</code>
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
                        keyField="number"
                        columns={columns}
                        data={projects}

                        defaultSortFieldId={sort_ref.current}
                        defaultSortAsc={order_ref.current === 'asc' ? false : true}

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