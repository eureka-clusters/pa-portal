import React from 'react';
import {useAuth} from "context/user-context";
import axios from 'axios';
import {apiStates, GetServerUri} from "function/api/index";
import {Facets} from "interface/statistics/partner/facets";

export {apiStates, ApiError, getFilter} from 'function/api/index';

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

    const load = () => {

        const setPartData = (partialData: { state: string; facets?: Facets; error?: string; }) => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        axios.create({
            baseURL: serverUri + '/api',
            timeout: 5000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${jwtToken}`
            }
        }).get<Facets>('/statistics/facets/partner/' + filter)
            .then(response => {
                //Use a local const to have the proper TS typehinting
                const {data} = response;
                setPartData({
                    state: apiStates.SUCCESS,
                    facets: data
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
    };

    React.useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    return {...hookState, load: load};
}
