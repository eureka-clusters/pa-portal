import {createSearchParams} from "react-router-dom";
import {AxiosInstance} from "axios";
import {Version} from "@/interface/project/version";

interface ProjectResponse {
    _embedded: {
        items: Version[]
    },
    page_count: number,
    total_items: number,
    page: number
}


export const getProjectVersions = ({authAxios, projectSlug}: {
    authAxios: AxiosInstance,
    projectSlug?: string
}) => {
    let searchParams = createSearchParams();

    if (projectSlug) {
        searchParams.append('project', projectSlug);
    }


    let url = 'list/project/version?' + searchParams.toString();

    return authAxios.get<ProjectResponse>(url).then(response => {
        const {data} = response;

        return {
            versions: data._embedded.items,
            amountOfPages: data.page_count,
            currentPage: data.page,
            totalItems: data.total_items,
        };
    });
}
