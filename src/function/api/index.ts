import Config from "constants/config";

export {getFilter} from 'function/api/filter-functions';
export {ApiError} from 'function/api/api-error';

export const apiStates = {
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
}

export const GetServerUri = () => {
    return Config.SERVER_URI;
};