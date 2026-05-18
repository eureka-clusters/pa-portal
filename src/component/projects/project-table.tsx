import {useMemo, useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {ColumnDef, PaginationState, SortingState} from "@tanstack/react-table";
import {Link} from "react-router-dom";

import {PaginatedDataTable} from "@/component/partial/paginated-data-table";
import downloadBase64File from "@/functions/download-base64";
import {useGetFilterOptions} from "@/functions/filter-functions";
import {CostsFormat, DateFormat, EffortFormat} from "@/functions/utils";
import {getProjects} from "@/hooks/project/get-projects";
import {Project} from "@/interface/project";
import {FacetValues} from "@/interface/statistics/facet-values";
import {useAxios} from "@/providers/axios-provider";

const ProjectTable = ({facetValues}: { facetValues?: FacetValues }) => {
    const {authAxios} = useAxios();
    const filterOptions = useGetFilterOptions();
    const [isExportLoading, setIsExportLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns = useMemo<ColumnDef<Project>[]>(() => [
        {
            accessorKey: "number",
            header: "Number",
        },
        {
            accessorKey: "name",
            header: "Project",
            cell: ({row}) => <Link to={`/project/${row.original.slug}`}>{row.original.name}</Link>,
        },
        {
            accessorKey: "primaryCluster",
            header: "Primary cluster (secondary)",
            cell: ({row}) => row.original.secondaryCluster
                ? `${row.original.primaryCluster.name} (${row.original.secondaryCluster.name})`
                : row.original.primaryCluster.name,
        },
        {
            accessorKey: "programmeCall",
            header: "Programme call",
        },
        {
            accessorKey: "officialStartDate",
            header: "Start date",
            cell: ({row}) => row.original.officialStartDate
                ? <DateFormat>{row.original.officialStartDate}</DateFormat>
                : "-",
        },
        {
            accessorKey: "officialEndDate",
            header: "End date",
            cell: ({row}) => row.original.officialEndDate
                ? <DateFormat>{row.original.officialEndDate}</DateFormat>
                : "-",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({row}) => row.original.status.status,
        },
        {
            accessorKey: "latestVersionEffort",
            meta: {align: "right"},
            header: "Latest version effort",
            cell: ({row}) => <EffortFormat>{row.original.latestVersionEffort}</EffortFormat>,
        },
        {
            accessorKey: "latestVersionCosts",
            meta: {align: "right"},
            header: "Latest version costs",
            cell: ({row}) => <CostsFormat>{row.original.latestVersionCosts}</CostsFormat>,
        },
    ], []);

    const dataQuery = useQuery({
        queryKey: ["project_data", facetValues, filterOptions, pagination, sorting],
        placeholderData: keepPreviousData,
        queryFn: () => getProjects({
            authAxios,
            filterOptions,
            facetValues,
            paginationOptions: pagination,
            sortingOptions: sorting,
        }),
    });

    const handleExport = async () => {
        setIsExportLoading(true);

        try {
            const response = await authAxios.get(`/statistics/results/project/download/${btoa(JSON.stringify(facetValues ?? {}))}`);
            downloadBase64File(response.data.mimetype, response.data.download, `Download${response.data.extension}`);
        } finally {
            setIsExportLoading(false);
        }
    };

    return (
        <PaginatedDataTable
            data={dataQuery.data?.projects ?? []}
            columns={columns}
            pagination={pagination}
            sorting={sorting}
            pageCount={dataQuery.data?.amountOfPages ?? 0}
            isFetching={dataQuery.isFetching}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            exportAction={{
                isLoading: isExportLoading,
                loadingText: "Exporting...",
                onClick: handleExport,
                label: "Export to Excel",
            }}
        />
    );
};

export default ProjectTable;
