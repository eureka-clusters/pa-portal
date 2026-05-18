import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    OnChangeFn,
    PaginationState,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

import LoadingButton from "@/component/partial/loading-button";

type ColumnMeta = {
    align?: "left" | "center" | "right";
};

interface ExportAction {
    isLoading: boolean;
    loadingText?: string;
    onClick: () => void;
    label: string;
}

interface PaginatedDataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    pagination: PaginationState;
    sorting: SortingState;
    pageCount: number;
    isFetching?: boolean;
    onPaginationChange: OnChangeFn<PaginationState>;
    onSortingChange: OnChangeFn<SortingState>;
    exportAction?: ExportAction;
}

export function PaginatedDataTable<TData>({
    data,
    columns,
    pagination,
    sorting,
    pageCount,
    isFetching = false,
    onPaginationChange,
    onSortingChange,
    exportAction,
}: PaginatedDataTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            pagination,
            sorting,
        },
        onPaginationChange,
        onSortingChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        manualSorting: true,
    });

    const alignmentClassNames: Record<NonNullable<ColumnMeta["align"]>, string> = {
        left: "text-start",
        center: "text-center",
        right: "text-end",
    };

    return (
        <div className="p-0">
            <table className="table table-striped table-sm">
                <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id} colSpan={header.colSpan}>
                                {header.isPlaceholder ? null : (
                                    <button
                                        type="button"
                                        className={`btn btn-link p-0 text-decoration-none ${
                                            header.column.getCanSort() ? "cursor-pointer select-none" : "pe-none text-body"
                                        }`}
                                        onClick={header.column.getToggleSortingHandler()}
                                        disabled={!header.column.getCanSort()}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{
                                            asc: " \u2191",
                                            desc: " \u2193",
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </button>
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                            const meta = cell.column.columnDef.meta as ColumnMeta | undefined;

                            return (
                                <td key={cell.id} className={meta?.align ? alignmentClassNames[meta.align] : undefined}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="d-flex align-content-start gap-2">
                <div>
                    <button
                        type="button"
                        className="border rounded p-1"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {"<<"}
                    </button>
                    <button
                        type="button"
                        className="border rounded p-1"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {"<"}
                    </button>
                    <button
                        type="button"
                        className="border rounded p-1"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {">"}
                    </button>
                    <button
                        type="button"
                        className="border rounded p-1"
                        onClick={() => table.setPageIndex(Math.max(table.getPageCount() - 1, 0))}
                        disabled={!table.getCanNextPage()}
                    >
                        {">>"}
                    </button>
                </div>
                <div>
                    <strong>
                        Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
                    </strong>

                    <span className="px-3">Go to page:</span>
                    <input
                        type="number"
                        min={1}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(event) => {
                            const page = event.target.value ? Number(event.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        className="border p-1 rounded w-16"
                    />
                </div>
                <div>
                    <select
                        className="form-select"
                        value={table.getState().pagination.pageSize}
                        onChange={(event) => {
                            table.setPageSize(Number(event.target.value));
                        }}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                {exportAction ? (
                    <div>
                        <LoadingButton
                            isLoading={exportAction.isLoading}
                            loadingText={exportAction.loadingText}
                            onClick={exportAction.onClick}
                        >
                            {exportAction.label}
                        </LoadingButton>
                    </div>
                ) : null}
                <div>{isFetching ? "Loading..." : null}</div>
            </div>
        </div>
    );
}
