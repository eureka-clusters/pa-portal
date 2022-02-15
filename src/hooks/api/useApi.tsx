import { useRef, useCallback, FC} from 'react'
import Config from 'constants/config'
import {useAuth} from "context/user-context";
import _ from 'lodash';
import reactStringReplace from 'react-string-replace';
import {iApiError} from 'hooks/api/interfaces';
export type { iApiError }
export { ApiError } from 'hooks/api/api-error';

export const getServerUri = () => {
    return Config.SERVER_URI;
};

export const apiStates = {
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
}

const defaultSettings = {
    tokenMethod: 'jwt',
    tokenRequired: true,
    parseUrl: false,
}

export function useApi(url: any, queryParameterDefault = {}, requestOptionsDefault = {}, settings = { tokenMethod: defaultSettings.tokenMethod, tokenRequired: defaultSettings.tokenRequired, parseUrl: defaultSettings.parseUrl}) {

    const mountedRef = useRef(true);
    const auth = useAuth();

    const queryParameterRef = useRef(queryParameterDefault);
    const requestOptionsRef = useRef(requestOptionsDefault);
    
    const call = useCallback(async (queryParameter, requestOptions) => {

        const defaultOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization':'',
            }
        }

        // const substituteUrl = (str, data) => {
        const substituteUrl = (str: string, data: {}) => {

            const reg = /\{([a-z|A-Z|0-9|_|.]+)\}/g;

            // version which works with child objects like {organisation.name}
            var output = reactStringReplace(str, reg, (match, i) => (
                fetchFromObject(data, match)
            ));
          
            return output.join('');
        }

        // function fetchFromObject(obj, prop) {
        // function fetchFromObject(obj: { [x: string]: any; }, prop: string) {
        function fetchFromObject(obj: any, prop: string):any {
            if (typeof obj === 'undefined') {
                return false;
            }
            var _index = prop.indexOf('.')
            if (_index > -1) {
                return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
            }
            
            const return_value = obj[prop];
            delete obj[prop];
            return return_value;
        }

        function updateOptions(mergeOptions:any) {
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
            let requestUrl = serverUri + '/api' + url;

            if (settings.parseUrl === true && requestUrl.includes('{') && queryParameterRef !== undefined) {
                // url should be parsed to add the parameters directly
                // each parameter found will be replaced and removed from queryParameterRef so they aren't attached 2 times.
                requestUrl = substituteUrl(requestUrl, queryParameterRef.current);
            }

            if (queryParameterRef !== undefined) {
                requestUrl += '?' + new URLSearchParams(queryParameterRef.current).toString();
            }

            // console.log(['requestUrl', requestUrl]);

            //create Request object
            const request = new Request(requestUrl, options);

            //Making the request
            const response = await fetch(request);

            // console.log(['response', response]);
            const result = await response.json(); // parsing the response

            if (response.ok) {
                return result;      // return success object
            }

            // error handling
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

