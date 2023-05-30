import {AxiosInstance} from "axios";
import {Facets} from "@/interface/statistics/project/facets";
import {FacetValues} from "@/interface/statistics/facet-values";

export const getProjectFacets = ({authAxios, facetValues}: {
    authAxios: AxiosInstance,
    facetValues: FacetValues
}) => {

    const url = "/statistics/facets/project/" + btoa(JSON.stringify(facetValues));
    return authAxios.get<Facets>(url).then(response => {
        const {data} = response;

        return data;
    });
}
