import Config from "constants/config";

export {getFilter} from 'function/api/filter-functions';

export const GetServerUri = () => {
    return Config.SERVER_URI;
};

export function objToQueryString(obj: any) {
    const keyValuePairs = [];
    for (const key in obj) {
        keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return keyValuePairs.join('&');
}
