import React from 'react';
import {UseAuth} from "context/user-context";
import axios from 'axios';
import {apiStates, GetServerUri} from "function/api/index";
import {Organisation} from "interface/organisation";

export {apiStates} from 'function/api/index';
export {ApiError} from 'function/api/index';

interface OrganisationState {
    state: string;
    error?: string
    organisation: Organisation
}

export const GetOrganisation = (slug: string) => {

    let auth = UseAuth();
    const serverUri = GetServerUri();
    let jwtToken = auth.getToken();

    const [hookState, setHookState] = React.useState<OrganisationState>({
        state: apiStates.LOADING,
        error: '',
        organisation: {} as Organisation
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

        const setPartData = (partialData: { state: string; organisation?: Organisation; error?: string; }) => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        createInstance().then(axios => {
            // axios automatically returns json in response.data and catches errors 
            axios.get<Organisation>('view/organisation/' + slug, {
                // settings could be overwritten
                // timeout: 1000
            })
                .then(response => {
                    //Use a local const to have the proper TS typehinting
                    const {data} = response;

                    setPartData({
                        state: apiStates.SUCCESS,
                        organisation: data
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
    }, [slug]);

    return {...hookState, load: load};
}
