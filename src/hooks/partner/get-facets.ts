import {AxiosInstance} from "axios";
import {Facets} from "@/interface/statistics/partner/facets";
import {FacetValues} from "@/interface/statistics/facet-values";

export const getPartnerFacets = ({authAxios, facetValues}: {
    authAxios: AxiosInstance,
    facetValues: FacetValues
}) => {

    const url = "/statistics/facets/partner/" + btoa(JSON.stringify(facetValues));
    return authAxios.get<Facets>(url).then(response => {
        const {data} = response;

        return data;
    });
}
