import {createSearchParams} from "react-router-dom";
import {FilterOptions} from '@/functions/filter-functions';
import {AxiosInstance} from "axios";
import {Project} from "@/interface/project";
import {Organisation} from "@/interface/organisation";

interface SearchResponse {
    _embedded: {
        items: Project[] | Organisation[]
    },
    page_count: number,
    total_items: number,
    page: number
}


export const getSearchResults = ({authAxios, filterOptions, query}: {
    authAxios: AxiosInstance,
    filterOptions: FilterOptions,
    query: string
}) => {

    filterOptions.query = query;

    let url = 'search/result?' + createSearchParams(filterOptions).toString();
    return authAxios.get<SearchResponse>(url).then(response => {
        const {data} = response;

        const hasNext = data.page_count > data.page;
        const hasPrevious = data.page_count < data.page;

        return {
            results: data._embedded.items,
            amountOfPages: data.page_count,
            currentPage: data.page,
            totalItems: data.total_items,
            nextPage: hasNext ? filterOptions.page + 1 : undefined,
            previousPage: hasPrevious ? parseInt(filterOptions.page) - 1 : undefined,
        };
    });
}
