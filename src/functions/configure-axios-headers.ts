import axios from "axios";
import {getServerUri} from "function/get-server-uri";

export const configureAxiosHeaders = (token: string) => {
    axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    axios.defaults.headers.common["Accept"] = 'application/json';
    axios.defaults.headers.common["Content-Type"] = 'application/json';

    axios.defaults.baseURL = getServerUri() + '/api';
};