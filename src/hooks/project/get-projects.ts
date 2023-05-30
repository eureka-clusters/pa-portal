import {createSearchParams} from "react-router-dom";
import {FilterOptions} from '@/functions/filter-functions';
import {Project} from "@/interface/project";
import {AxiosInstance} from "axios";
import {FacetValues} from "@/interface/statistics/facet-values";
import {PaginationState, SortingState} from "@tanstack/react-table";

interface ProjectResponse {
    _embedded: {
        items: Project[]
    },
    page_count: number,
    total_items: number,
    page: number
}


export const getProjects = ({authAxios, filterOptions, facetValues, paginationOptions, sortingOptions}: {
    authAxios: AxiosInstance,
    filterOptions: FilterOptions,
    facetValues?: FacetValues,
    paginationOptions: PaginationState,
    sortingOptions?: SortingState
}) => {


    let searchParams = createSearchParams(filterOptions);

    searchParams.append('page', (paginationOptions.pageIndex + 1).toString());
    searchParams.append('pageSize', paginationOptions.pageSize.toString());

    if (facetValues) {
        searchParams.append('filter', btoa(JSON.stringify(facetValues)));
    }

    if (sortingOptions !== undefined && sortingOptions.length > 0) {
        searchParams.append('order', sortingOptions[0].id);
        searchParams.append('direction', sortingOptions[0].desc ? 'desc' : 'asc');
    }

    let url = 'list/project?' + searchParams.toString();

    return authAxios.get<ProjectResponse>(url).then(response => {
        const {data} = response;

        const hasNext = data.page_count > data.page;
        const hasPrevious = data.page_count < data.page;

        return {
            projects: data._embedded.items,
            amountOfPages: data.page_count,
            currentPage: data.page,
            totalItems: data.total_items,
            nextPage: hasNext ? paginationOptions.pageIndex + 1 : undefined,
            previousPage: hasPrevious ? paginationOptions.pageIndex - 1 : undefined,
        };
    });
}
