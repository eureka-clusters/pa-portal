import Config from "../../constants/config";
import axios from "axios";


export function getServices() {

    return axios.create().get<any>(Config + '/list/services')
        .then(response => {
            return response;
        });
}
