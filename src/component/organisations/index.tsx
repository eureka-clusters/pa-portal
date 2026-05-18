import {useMemo, useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {ColumnDef, PaginationState, SortingState} from "@tanstack/react-table";
import {Link} from "react-router-dom";

import {PaginatedDataTable} from "@/component/partial/paginated-data-table";
import {useGetFilterOptions} from "@/functions/filter-functions";
import {getOrganisations} from "@/hooks/organisation/get-organisations";
import {Organisation} from "@/interface/organisation";
import {FacetValues} from "@/interface/statistics/facet-values";
import {useAxios} from "@/providers/axios-provider";

const OrganisationTable = ({facetValues}: { facetValues?: FacetValues }) => {
    const {authAxios} = useAxios();
    const filterOptions = useGetFilterOptions();
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns = useMemo<ColumnDef<Organisation>[]>(() => [
        {
            accessorKey: "organisation",
            header: "Organisation",
            cell: ({row}) => <Link to={`/organisations/${row.original.slug}`}>{row.original.name}</Link>,
        },
        {
            accessorKey: "country",
            header: "Country",
            cell: ({row}) => row.original.country.country,
        },
        {
            accessorKey: "name",
            header: "Type",
            cell: ({row}) => row.original.type.type,
        },
    ], []);

    const dataQuery = useQuery({
        queryKey: ["organisation_data", facetValues, filterOptions, pagination, sorting],
        placeholderData: keepPreviousData,
        queryFn: () => getOrganisations({
            authAxios,
            filterOptions,
            paginationOptions: pagination,
            sortingOptions: sorting,
        }),
    });

    return (
        <PaginatedDataTable
            data={dataQuery.data?.organisations ?? []}
            columns={columns}
            pagination={pagination}
            sorting={sorting}
            pageCount={dataQuery.data?.amountOfPages ?? 0}
            isFetching={dataQuery.isFetching}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
        />
    );
};

export default OrganisationTable;
