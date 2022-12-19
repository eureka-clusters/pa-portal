import axios from "axios";
import {getServerUri} from "functions/get-server-uri";

export const configureAxiosHeaders = (token: string) => {
    axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;


    axios.defaults.baseURL = getServerUri() + '/api';
};