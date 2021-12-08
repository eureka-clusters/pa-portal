import React from 'react';
import { useAuth} from "context/user-context";
import axios from 'axios';
import {apiStates, GetServerUri} from 'function/api/index';
import {Partner} from "interface/project/partner";

export {apiStates} from 'function/api/index';
export {ApiError} from 'function/api/index';

interface PartnerState {
    state: string;
    error?: string
    partner: Partner
}

export const GetPartner = (slug: string) => {

    let auth = useAuth();
    const serverUri = GetServerUri();
    let jwtToken = auth.getJwtToken();

    const [hookState, setHookState] = React.useState<PartnerState>({
        state: apiStates.LOADING,
        error: '',
        partner: {} as Partner
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

        const setPartData = (partialData: { state: string; partner?: Partner; error?: string; }) => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        createInstance().then(axios => {
            // axios automatically returns json in response.data and catches errors 
            axios.get<Partner>('view/partner/' + slug, {
                // settings could be overwritten
                // timeout: 1000
            })
                .then(response => {
                    //Use a local const to have the proper TS typehinting
                    const {data} = response;

                    setPartData({
                        state: apiStates.SUCCESS,
                        partner: data
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