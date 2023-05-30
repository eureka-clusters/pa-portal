import React, {useContext, useState} from 'react';
import {Organisation} from "@/interface/organisation";
import {FacetValues} from "@/interface/statistics/facet-values";
import {useGetFilterOptions} from '@/functions/filter-functions';
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery} from "@tanstack/react-query";
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
import {Link} from "react-router-dom";
import {getOrganisations} from "@/hooks/organisation/get-organisations";

const organisationTable = ({facetValues}: { facetValues?: FacetValues }) => {

    const defaultData = React.useMemo(() => [], [])
    const filterOptions = useGetFilterOptions();
    const axiosContext = useContext(AxiosContext);
    const [isExportLoading, setIsExportButtonLoading] = useState(false);
    const authAxios = useContext(AxiosContext).authAxios;

    const columns = React.useMemo<ColumnDef<Organisation>[]>(
        () => [

            {
                accessorKey: 'organisation',
                cell: ({row}) => (
                    <Link to={{pathname: `/organisations/${row.original.slug}`}}>{row.original.name}</Link>),
                header: () => <span>Organisation</span>,
            },
            {
                accessorKey: 'country',
                header: () => <span>Country</span>,
                cell: ({row}) => row.original.country.country
            },
            {
                accessorKey: 'name',
                header: () => <span>Type</span>,
                cell: ({row}) => row.original.type.type
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
        ['organisation_data', facetValues, filterOptions, pagination, sorting],
        () => getOrganisations({
            authAxios: authAxios,
            filterOptions: filterOptions,
            paginationOptions: pagination,
            sortingOptions: sorting,
        }),
        {keepPreviousData: true}
    )

    const table = useReactTable({
        data: dataQuery.data?.organisations ?? defaultData,
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
                    {dataQuery.isFetching ? 'Loading...' : null}
                </div>
            </div>
        </div>
    )
}

export default organisationTable;