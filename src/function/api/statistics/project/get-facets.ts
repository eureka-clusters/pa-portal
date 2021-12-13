import React from 'react';
import {useAuth} from "context/user-context";
import axios from 'axios';
import {apiStates, GetServerUri} from "function/api/index";
import {Facets} from "interface/statistics/project/facets";

export {apiStates, ApiError, getFilter} from 'function/api/index';


interface FacetResponse {
    _embedded: {
        facets: Array<Facets>
    }
}


interface FacetState {
    state: string;
    error?: string
    facets: Facets
}

export const GetFacets = (filter: string) => {

    let auth = useAuth();
    const serverUri = GetServerUri();
    let jwtToken = auth.getJwtToken();

    const [hookState, setHookState] = React.useState<FacetState>({
        state: apiStates.LOADING,
        error: '',
        facets: {} as Facets
    });

    const createInstance = async () => {
        return axios.create({
            baseURL: serverUri + '/api',
            timeout: 5000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${jwtToken}`
            }
        });
    };

    const load = () => {

        const setPartData = (partialData: { state: string; facets?: Facets; error?: string; }) => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        createInstance().then(axios => {
            // axios automatically returns json in response.data and catches errors 
            // axios.get<FacetResponse>('/statistics/facets/project?filter=' + filter, {
            // axios.get<Facets>('/statistics/facets/project?filter=' + filter, {
            axios.get<any>('/statistics/facets/project?filter=' + filter, {
                // settings could be overwritten
                // timeout: 1000
            })
                .then(response => {
                    //Use a local const to have the proper TS typehinting
                    const {data} = response;
                    // console.log(['response', response]);
                    // console.log(['data._embedded.facets', data._embedded.facets]);
                    // console.log(['data._embedded.facets[0]', data._embedded.facets[0]]);

                    // if user is not a funder it will return [];
                    var facets = [];
                    if (data._embedded.facets[0] !== undefined) {
                        facets = data._embedded.facets[0];
                    } 
                    setPartData({
                        state: apiStates.SUCCESS,
                        // facets: data
                        facets: facets
                    })
                }).catch(function (error) {
                if (error.response) {
                    setPartData({
                        state: apiStates.ERROR,
                        error: error.response.data.title + ' ' + error.response.data.status + '\n' + error.response.data.detail
                    });
                } else if (error.request) {
                    // The request timed out
                    console.log(error.request);
                    setPartData({
                        state: apiStates.ERROR,
                        error: 'The request timed out'
                    });
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    setPartData({
                        state: apiStates.ERROR,
                        error: 'Something happened in setting up the request that triggered an Error'
                    });
                }
            })

        })

    };

    React.useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    return {...hookState, load: load};
}
