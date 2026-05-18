import {createSearchParams} from "react-router-dom";
import {FilterOptions} from '@/functions/filter-functions';
import {AxiosInstance} from "axios";
import {itemProps} from "@/component/search/search-list-entry";

interface SearchResponse {
    _embedded: {
        items: itemProps[]
    },
    page_count: number,
    total_items: number,
    page: number
}


export const getSearchResults = ({authAxios, filterOptions, query, page}: {
    authAxios: AxiosInstance,
    filterOptions: FilterOptions,
    query: string,
    page: number
}) => {
    const url = `search/result?${createSearchParams({
        ...filterOptions,
        query,
    }).toString()}`;
    return authAxios.get<SearchResponse>(url).then(response => {
        const {data} = response;

        const hasNext = data.page_count > data.page;
        const hasPrevious = data.page_count < data.page;

        return {
            results: data._embedded.items,
            amountOfPages: data.page_count,
            currentPage: data.page,
            totalItems: data.total_items,
            nextPage: hasNext ? page + 1 : undefined,
            previousPage: hasPrevious ? page - 1 : undefined,
        };
    });
}
