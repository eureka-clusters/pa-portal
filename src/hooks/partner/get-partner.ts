import {AxiosInstance} from "axios";
import {Partner} from "@/interface/project/partner";

export const getPartner = ({authAxios, slug}: { authAxios: AxiosInstance, slug: string }) => {

    let url = 'view/partner/' + slug
    return authAxios.get<Partner>(url).then(response => {
        const {data} = response;

        return data;
    });
}
