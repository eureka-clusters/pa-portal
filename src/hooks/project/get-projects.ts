import {createSearchParams} from "react-router-dom";
import {FilterOptions} from '@/functions/filter-functions';
import {Project} from "@/interface/project";
import {AxiosInstance} from "axios";
import {FilterValues} from "@/interface/statistics/filter-values";

interface ProjectResponse {
    _embedded: {
        items: Project[]
    },
    page_count: number,
    total_items: number,
    page: number
}


export const getProjects = ({authAxios, filterOptions, filterValues, page}: {
    authAxios: AxiosInstance,
    filterOptions: FilterOptions,
    filterValues?: FilterValues,
    page: number
}) => {

    if (filterValues) {
        filterOptions.filter = btoa(JSON.stringify(filterValues));
    }

    let url = 'list/project?' + createSearchParams(filterOptions).toString();

    url += '&page=' + page;

    return authAxios.get<ProjectResponse>(url).then(response => {
        const {data} = response;

        const hasNext = data.page_count > data.page;
        const hasPrevious = data.page_count < data.page;

        return {
            projects: data._embedded.items,
            amountOfPages: data.page_count,
            currentPage: data.page,
            totalItems: data.total_items,
            nextPage: hasNext ? page + 1 : undefined,
            previousPage: hasPrevious ? page - 1 : undefined,
        };
    });
}
