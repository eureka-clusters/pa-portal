import {createSearchParams} from "react-router-dom";
import {FilterOptions} from '@/functions/filter-functions';
import {AxiosInstance} from "axios";
import {Organisation} from "@/interface/organisation";
import {PaginationState, SortingState} from "@tanstack/react-table";

interface OrganisationResponse {
    _embedded: {
        items: Organisation[]
    },
    page_count: number,
    total_items: number,
    page: number
}


export const getOrganisations = ({authAxios, filterOptions, paginationOptions, sortingOptions}: {
    authAxios: AxiosInstance,
    filterOptions: FilterOptions,
    paginationOptions: PaginationState,
    sortingOptions?: SortingState
}) => {

    let searchParams = createSearchParams(filterOptions);

    searchParams.append('page', (paginationOptions.pageIndex + 1).toString());
    searchParams.append('pageSize', paginationOptions.pageSize.toString());

    if (sortingOptions !== undefined && sortingOptions.length > 0) {
        searchParams.append('order', sortingOptions[0].id);
        searchParams.append('direction', sortingOptions[0].desc ? 'desc' : 'asc');
    }

    let url = 'list/organisation?' + searchParams.toString();

    return authAxios.get<OrganisationResponse>(url).then(response => {
        const {data} = response;
        const hasNext = data.page_count > data.page;
        const hasPrevious = data.page_count < data.page;

        return {
            organisations: data._embedded.items,
            amountOfPages: data.page_count,
            currentPage: data.page,
            totalItems: data.total_items,
            nextPage: hasNext ? paginationOptions.pageIndex + 1 : undefined,
            previousPage: hasPrevious ? paginationOptions.pageIndex - 1 : undefined,
        };
    });
}
