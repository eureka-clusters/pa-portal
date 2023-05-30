import React, {useContext, useEffect, useState} from 'react';
import {getProjects} from "@/hooks/project/get-projects";
import {Project} from "@/interface/project";
import {FacetValues} from "@/interface/statistics/facet-values";
import {useGetFilterOptions} from '@/functions/filter-functions';
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery} from "@tanstack/react-query";
import LoadingButton from "@/component/partial/loading-button";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import downloadBase64File from "@/functions/download-base64";
import {Link} from "react-router-dom";
import {CostsFormat, EffortFormat} from "@/functions/utils";

const ProjectTable = ({facetValues}: { facetValues?: FacetValues }) => {

    const defaultData = React.useMemo(() => [], [])
    const filterOptions = useGetFilterOptions();
    const axiosContext = useContext(AxiosContext);
    const [isExportLoading, setIsExportButtonLoading] = useState(false);
    const authAxios = useContext(AxiosContext).authAxios;

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
        await axiosContext.authAxios.get('/statistics/results/project/download/' + btoa(JSON.stringify(facetValues)))
            .then((res: any) => {
                let extension = res.data.extension;
                let mimetype = res.data.mimetype;
                downloadBase64File(mimetype, res.data.download, 'Download' + extension);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const columns = React.useMemo<ColumnDef<Project>[]>(
        () => [
            {
                accessorKey: 'number',
                header: () => <span>Number</span>,
                cell: project => project.getValue(),
            },
            {
                accessorKey: 'name',
                cell: ({row}) => (
                    <Link to={{pathname: `/project/${row.original.slug}`}}>{row.original.name}</Link>),
                header: () => <span>Project</span>,
            },
            {
                accessorKey: 'primaryCluster',
                header: () => <span>Primary cluster</span>,
                cell: ({row}) => row.original.primaryCluster.name
            },
            {
                accessorKey: 'secondaryCluster',
                header: () => <span>Secondary cluster</span>,
                cell: ({row}) => row.original.secondaryCluster?.name
            },
            {
                accessorKey: 'programme',
                header: () => <span>Programme</span>,
                cell: ({row}) => row.original.programme
            },
            {
                accessorKey: 'status',
                header: () => <span>Status</span>,
                cell: ({row}) => row.original.status.status
            },
            {
                accessorKey: 'latestVersionTotalEffort',
                header: () => <span>Latest version effort</span>,
                cell: ({row}) => (<EffortFormat>{row.original.latestVersionTotalEffort}</EffortFormat>)
            },
            {
                accessorKey: 'latestVersionTotalCosts',
                header: () => <span>Latest version effort</span>,
                cell: ({row}) => (<CostsFormat>{row.original.latestVersionTotalCosts}</CostsFormat>)
            },
        ],
        []
    )

    const [pagination, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 20,
        })
    const [sorting, setSorting] = React.useState<SortingState>([])

    const dataQuery = useQuery(
        ['project_data', facetValues, filterOptions, pagination, sorting],
        () => getProjects({
            authAxios: authAxios,
            filterOptions: filterOptions,
            facetValues: facetValues,
            paginationOptions: pagination,
            sortingOptions: sorting,
        }),
        {keepPreviousData: true}
    )

    const table = useReactTable({
        data: dataQuery.data?.projects ?? defaultData,
        columns,
        pageCount: dataQuery.data?.amountOfPages ?? -1,
        state: {
            pagination,
            sorting,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getFilteredRowModel(),
        manualPagination: true,
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: false,
    })

    return (
        <div className="p-0">
            <div className="h-2"/>
            <table className={'table table-striped table-sm'}>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                            return (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : '',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    )}
                                </th>
                            )
                        })}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => {
                    return (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
            <div className="h-2"/>


            <div className="d-flex align-content-start gap-2">
                <div>
                    <button
                        className="border rounded p-1"
                        onClick={e => {
                            e.preventDefault();
                            table.setPageIndex(0)
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={e => {
                            e.preventDefault();
                            table.previousPage()
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={e => {
                            e.preventDefault();
                            table.nextPage()
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={e => {
                            e.preventDefault();
                            table.setPageIndex(table.getPageCount() - 1)
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </button>
                </div>
                <div>

                    <strong>
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>

                    <span className={'px-3'}> Go to page: </span>
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16"
                    />
                </div>
                <div>
                    <select
                        className={'form-select'}
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <LoadingButton
                        isLoading={isExportLoading}
                        loadingText='Exporting...'
                        onClick={() => setIsExportButtonLoading(true)}
                    >
                        Export to Excel
                    </LoadingButton>
                </div>
                <div>
                    {dataQuery.isFetching ? 'Loading...' : null}
                </div>
            </div>
        </div>
    )
}

export default ProjectTable;