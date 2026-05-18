import {useMemo, useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {ColumnDef, PaginationState, SortingState} from "@tanstack/react-table";
import {Link} from "react-router-dom";

import {PaginatedDataTable} from "@/component/partial/paginated-data-table";
import downloadBase64File from "@/functions/download-base64";
import {useGetFilterOptions} from "@/functions/filter-functions";
import {CostsFormat, EffortFormat} from "@/functions/utils";
import {getPartners} from "@/hooks/partner/get-partners";
import {FacetValues} from "@/interface/statistics/facet-values";
import {Partner} from "@/interface/project/partner";
import {useAxios} from "@/providers/axios-provider";

const PartnerTable = ({facetValues}: { facetValues?: FacetValues }) => {
    const {authAxios} = useAxios();
    const filterOptions = useGetFilterOptions();
    const [isExportLoading, setIsExportLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns = useMemo<ColumnDef<Partner>[]>(() => [
        {
            accessorKey: "organisation",
            header: "Organisation",
            cell: ({row}) => <Link to={`/project/partner/${row.original.slug}`}>{row.original.organisation.name}</Link>,
        },
        {
            accessorKey: "project",
            header: "Project",
            cell: ({row}) => <Link to={`/project/${row.original.project.slug}`}>{row.original.project.name}</Link>,
        },
        {
            accessorKey: "projectStatus",
            header: "Project status",
            cell: ({row}) => row.original.project.status.status,
        },
        {
            accessorKey: "primaryCluster",
            header: "Primary cluster",
            cell: ({row}) => row.original.project.primaryCluster.name,
        },
        {
            accessorKey: "secondaryCluster",
            header: "Secondary cluster",
            cell: ({row}) => row.original.project.secondaryCluster?.name ?? "-",
        },
        {
            accessorKey: "country",
            header: "Country",
            cell: ({row}) => row.original.organisation.country.iso3,
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({row}) => row.original.organisation.type.type,
        },
        {
            accessorKey: "latestVersionEffort",
            header: "Latest version effort",
            meta: {align: "right"},
            cell: ({row}) => <EffortFormat>{row.original.latestVersionEffort}</EffortFormat>,
        },
        {
            accessorKey: "latestVersionCosts",
            header: "Latest version costs",
            meta: {align: "right"},
            cell: ({row}) => <CostsFormat>{row.original.latestVersionCosts}</CostsFormat>,
        },
    ], []);

    const dataQuery = useQuery({
        queryKey: ["project_partners", facetValues, filterOptions, pagination, sorting],
        placeholderData: keepPreviousData,
        queryFn: () => getPartners({
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
            const response = await authAxios.get(`/statistics/results/partner/download/${btoa(JSON.stringify(facetValues ?? {}))}`);
            downloadBase64File(response.data.mimetype, response.data.download, `Download${response.data.extension}`);
        } finally {
            setIsExportLoading(false);
        }
    };

    return (
        <PaginatedDataTable
            data={dataQuery.data?.partners ?? []}
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

export default PartnerTable;
