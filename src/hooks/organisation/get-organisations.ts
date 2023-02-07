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


export const getOrganisations = ({authAxios, filterOptions}: {
    authAxios: AxiosInstance,
    filterOptions: FilterOptions
}) => {

    let url = 'list/organisation?' + createSearchParams(filterOptions).toString();
    return authAxios.get<OrganisationResponse>(url).then(response => {
        const {data} = response;

        const hasNext = data.page_count > data.page;
        const hasPrevious = data.page_count < data.page;

        return {
            organisations: data._embedded.items,
            amountOfPages: data.page_count,
            currentPage: data.page,
            totalItems: data.total_items,
            nextPage: hasNext ? filterOptions.page + 1 : undefined,
            previousPage: hasPrevious ? parseInt(filterOptions.page) - 1 : undefined,
        };
    });
}
