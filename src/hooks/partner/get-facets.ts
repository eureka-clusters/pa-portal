import {AxiosInstance} from "axios";
import {Facets} from "@/interface/statistics/project/facets";
import {FilterValues} from "@/interface/statistics/filter-values";

export const getPartnerFacets = ({authAxios, filterValues}: {
    authAxios: AxiosInstance,
    filterValues: FilterValues
}) => {

    const url = "/statistics/facets/partner/" + btoa(JSON.stringify(filterValues));
    return authAxios.get<Facets>(url).then(response => {
        const {data} = response;

        return data;
    });
}
