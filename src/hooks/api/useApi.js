import { useRef, useCallback} from 'react'
import Config from 'constants/config'
import {useAuth} from "context/user-context";
import _ from 'lodash';

export const getServerUri = () => {
    return Config.SERVER_URI;
};
export { ApiError } from 'function/api/api-error';

export const apiStates = {
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
}

const defaultSettings = {
    tokenMethod: 'jwt',
    tokenRequired: true
}

export function useApi(url, queryParameterDefault = {}, requestOptionsDefault = {}, settings = { tokenMethod: defaultSettings.tokenMethod, tokenRequired: defaultSettings.tokenRequired}) {

    const mountedRef = useRef(true);
    const auth = useAuth();

    const queryParameterRef = useRef(queryParameterDefault);
    const requestOptionsRef = useRef(requestOptionsDefault);
    

    // const jwtToken = auth.getJwtToken();

    const call = useCallback(async (queryParameter, requestOptions) => {

        const defaultOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        function updateOptions(mergeOptions) {
            switch (settings.tokenMethod) {
                case 'jwt':
                default:
                    if (typeof auth.getJwtToken === "function") {
                        // todo: add switch between both auth methods JWT / Bearer Access Token
                        const jwtToken = auth.getJwtToken();
                        if (jwtToken !== undefined) {
                            // console.log(['jwtToken is not undefined', jwtToken]);
                            defaultOptions.headers.Authorization = `Bearer ${jwtToken}`;
                        } else {
                            // if token is required unmount.
                            if (settings.tokenRequired) {
                                // console.log(['jwtToken is undefined but required', jwtToken]);
                                mountedRef.current = false;
                            }
                        }
                    }
                    break;
            }
            // merge given mergeOptions and defaultOptions
            // this doesn't work with multidimensional arrays
            // return { ...defaultOptions, ...mergeOptions };

            // using loadash merge works
            return _.merge(defaultOptions, mergeOptions);
        }

        async function fetchFunction() {
            
            // console.log(['queryParameterRef in fetchFunction', queryParameterRef.current]);
            // console.log(['requestOptionsRef in fetchFunction', requestOptionsRef.current]);
            
            // create the options with the requestOptions
            // let options = requestOptionsRef.current;

            let options = updateOptions(requestOptionsRef.current); // test to add the default settings here or 
            
            console.log(['options in fetchFunction', options]);


            // skip request if token ins't set but required
            if (!mountedRef.current)  {
                const responseError = {
                    type: 'Error',
                    message: 'Token is not defined but required',
                    data: '',
                    code: 0
                }
                let error = new Error();
                error = { ...error, ...responseError };
                throw (error);   
            }

            // set default baseUrl
            const serverUri = getServerUri();

            // add api to the base server url
            const requestUrl = serverUri + '/api' + url;

            // add query parameters to the url
            var QueryUrl = new URL(requestUrl);
            if (queryParameterRef !== undefined) {
                console.log('add query params to the url', queryParameterRef.current);
                QueryUrl.search = new URLSearchParams(queryParameterRef.current).toString();
                
            }
            console.log(['QueryUrl.search', QueryUrl.search]);


            //Making the request
            const response = await fetch(QueryUrl, {
                ...options,
            });

            // console.log(['response', response]);
            const result = await response.json(); // parsing the response

            if (response.ok) {
                return result;      // return success object
            }

            // error handling
            // console.error('error on request result =', result);

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


        // store the newly added parameters which are given in the callback call
        // console.log(['store new queryParameter', queryParameter]);
        if (queryParameter !== undefined) {
            queryParameterRef.current = queryParameter;
        }

        // console.log(['store new requestOptions', requestOptions]);
        if (requestOptions!== undefined) {
            requestOptionsRef.current = requestOptions;

            // requestOptionsRef.current = updateOptions(requestOptions);  // update the options with new settings and default options
        }

        let callbackResult = await fetchFunction()
        // console.log(['callbackResult', callbackResult]);
        return callbackResult; 
        
    }, [auth, settings.tokenMethod, settings.tokenRequired, url]);
    
    return call
}

