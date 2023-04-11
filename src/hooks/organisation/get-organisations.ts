import {createSearchParams} from "react-router-dom";
import {FilterOptions} from '@/functions/filter-functions';
import {AxiosInstance} from "axios";
import {Organisation} from "@/interface/organisation";

interface OrganisationResponse {
    _embedded: {
        items: Organisation[]
    },
    page_count: number,
    total_items: number,
    page: number
}


export const getOrganisations = ({authAxios, filterOptions, page}: {
    authAxios: AxiosInstance,
    filterOptions: FilterOptions,
    page: number
}) => {

    let url = 'list/organisation?' + createSearchParams(filterOptions).toString();

    url += '&page=' + page;

    return authAxios.get<OrganisationResponse>(url).then(response => {
        const {data} = response;
        const hasNext = data.page_count > data.page;
        const hasPrevious = data.page_count < data.page;

        return {
            organisations: data._embedded.items,
            amountOfPages: data.page_count,
            currentPage: data.page,
            totalItems: data.total_items,
            nextPage: hasNext ? page + 1 : undefined,
            previousPage: hasPrevious ? page - 1 : undefined,
        };
    });
}
