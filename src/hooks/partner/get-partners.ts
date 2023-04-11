import {createSearchParams} from "react-router-dom";
import {FilterOptions} from '@/functions/filter-functions';
import {Organisation} from '@/interface/organisation';
import {Project} from '@/interface/project';
import {Partner} from "@/interface/project/partner";
import {AxiosInstance} from "axios";
import {FilterValues} from "@/interface/statistics/filter-values";

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
        filterValues,
        organisation,
        project,
        page
    }: {
        authAxios: AxiosInstance,
        filterOptions: FilterOptions,
        filterValues?: FilterValues
        organisation?: Organisation,
        project?: Project,
        page: number
    }) => {

    if (filterValues) {
        filterOptions.filter = btoa(JSON.stringify(filterValues));
    }

    let url = 'list/partner?' + createSearchParams(filterOptions).toString();

    if (organisation !== undefined) {
        url += '&organisation=' + organisation.slug;
    }
    if (project !== undefined) {
        url += '&project=' + project.slug;
    }

    url += '&page=' + page;

    return authAxios.get<PartnerResponse>(url).then(response => {
        const {data} = response;

        const hasNext = data.page_count > data.page;
        const hasPrevious = data.page_count < data.page;

        return {
            partners: data._embedded.items,
            amountOfPages: data.page_count,
            currentPage: data.page,
            totalItems: data.total_items,
            nextPage: hasNext ? page + 1 : undefined,
            previousPage: hasPrevious ? page - 1 : undefined,
        };
    });

}
