import {AxiosInstance} from "axios";
import {Project} from "@/interface/project";

export const getProject = ({authAxios, slug}: { authAxios: AxiosInstance, slug: string }) => {

    let url = 'view/project/' + slug
    return authAxios.get<Project>(url).then(response => {
        const {data} = response;

        return data;
    });
}
