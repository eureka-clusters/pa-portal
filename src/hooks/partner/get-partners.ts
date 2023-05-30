import {createSearchParams} from "react-router-dom";
import {FilterOptions} from '@/functions/filter-functions';
import {Organisation} from '@/interface/organisation';
import {Project} from '@/interface/project';
import {Partner} from "@/interface/project/partner";
import {AxiosInstance} from "axios";
import {FacetValues} from "@/interface/statistics/facet-values";
import {PaginationState, SortingState} from "@tanstack/react-table";

interface PartnerResponse {
    _embedded: {
        items: Partner[]
    },
    page_count: number,
    total_items: number,
    page: number
}


export const getPartners = (
    {
        authAxios,
        filterOptions,
        facetValues,
        paginationOptions,
        sortingOptions,
        organisation,
        project,
    }: {
        authAxios: AxiosInstance,
        filterOptions: FilterOptions,
        facetValues?: FacetValues,
        paginationOptions: PaginationState,
        sortingOptions?: SortingState
        organisation?: Organisation,
        project?: Project,
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

    if (organisation !== undefined) {
        searchParams.append('organisation', organisation.slug);
    }
    if (project !== undefined) {
        searchParams.append('project', project.slug);
    }

    let url = 'list/partner?' + createSearchParams(searchParams).toString();

    return authAxios.get<PartnerResponse>(url).then(response => {
        const {data} = response;

        const hasNext = data.page_count > data.page;
        const hasPrevious = data.page_count < data.page;

        return {
            partners: data._embedded.items,
            amountOfPages: data.page_count,
            currentPage: data.page,
            totalItems: data.total_items,
            nextPage: hasNext ? paginationOptions.pageIndex + 1 : undefined,
            previousPage: hasPrevious ? paginationOptions.pageIndex - 1 : undefined,
        };
    });

}
