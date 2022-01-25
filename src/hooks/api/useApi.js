import { useCallback} from 'react'
import Config from 'constants/config'
import { useAuth } from "context/user-context";
import _ from 'lodash';

export const getServerUri = () => {
    const serverUri = Config.SERVER_URI;
    return serverUri;
};

export const apiStates = {
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
}


export function useApi(url, globalOptions = {}) {
    
    const auth = useAuth();
    // const jwtToken = auth.getJwtToken();

    const defaultOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${jwtToken}`   // jwtToken could also be added directly then uncomment line above
        }
    }

    function updateOptions(options) {

        if (typeof auth.getJwtToken === "function") {

            // todo: add switch between both auth methods JWT / Bearer Access Token
            const jwtToken = auth.getJwtToken();
            if (jwtToken!==undefined) {
                defaultOptions.headers.Authorization = `Bearer ${jwtToken}`;
            }
        }
        
        // merge given options and defaultOptions
        // this doesn't work with multidimensional arrays
        // return { ...defaultOptions, ...options };

        // using loadash merge works
        return _.merge(defaultOptions, options);
    }

    async function fetchFunction() {
        let options = updateOptions(globalOptions);
        // console.log(['options in fetchFunction', options])

        // set default baseUrl
        const serverUri = getServerUri();

        // add api to the base server url
        const requestUrl = serverUri + '/api' + url;
        
        //Making the req
        const response = await fetch(requestUrl, {
            ...options,
        });

        console.log(['response', response]);


        const result = await response.json(); // parsing the response

        if (response.ok) {
            return result;      // return success object
        }

        // error handling
        console.error('error on request result =', result);

        const responseError = {
            type: 'Error',
            message: result.message || result.detail || 'Something went wrong',
            data: result.data || result.title || '',
            code: result.code || result.status,
        };

        let error = new Error();
        error = { ...error, ...responseError };
        throw (error);
    }

    const call = useCallback(async (settings) => {
        // console.log(['settings in useCallback', settings]);
        // console.log(['globalOptions in useCallback', globalOptions]);
        if (settings!== undefined) {
            globalOptions = updateOptions(settings);
        }

        let callbackResult = await fetchFunction()
        // console.log(['callbackResult', callbackResult]);
        return callbackResult; 
    }, [url, globalOptions]);

    return call
}

