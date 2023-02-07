import {AxiosInstance} from "axios";
import {Organisation} from "@/interface/organisation";

export const getOrganisation = ({authAxios, slug}: { authAxios: AxiosInstance, slug: string }) => {

    let url = 'view/organisation/' + slug
    return authAxios.get<Organisation>(url).then(response => {
        const {data} = response;

        return data;
    });
}
