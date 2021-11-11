import React from 'react';
import {UseAuth} from "../../context/UserContext";
import axios from 'axios';
import {apiStates, getServerUri} from "./index";
import {Partner} from "../../interface/project/partner";
import {Project} from "../../interface/project";
import {Organisation} from "../../interface/organisation";

export {apiStates} from './index';
export {ApiError} from './index';

interface PartnerResponse {
    _embedded: {
        partners: Array<Partner>
    }
}

interface PartnerState {
    state: string;
    error?: string
    partners: Array<Partner>
}

// interface Props {
//     project:?Project
// }

export function GetPartners(project?: Project | undefined, organisation?: Organisation | undefined) {

    let auth = UseAuth();
    const serverUri = getServerUri();
    let accessToken = auth.getToken();

    const [hookState, setHookState] = React.useState<PartnerState>({
        state: apiStates.LOADING,
        error: '',
        partners: []
    });

    const createInstance = async () => {
        return axios.create({
            baseURL: serverUri + '/api',
            timeout: 5000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
    };

    const load = () => {

        const setPartData = (partialData: { state: string; partners?: Array<Partner>; error?: string; }) => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        let url = 'list/partner';
        if (typeof project !== 'undefined') {
            url = 'list/partner?project=' + project.slug;
        }
        if (typeof organisation !== 'undefined') {
            url = 'list/partner?organisation=' + organisation.slug;
        }

        createInstance().then(axios => {
            // axios automatically returns json in response.data and catches errors 
            axios.get<PartnerResponse>(url, {
                // settings could be overwritten
                // timeout: 1000
            })
                .then(response => {
                    //Use a local const to have the proper TS typehinting
                    const {data} = response;

                    setPartData({
                        state: apiStates.SUCCESS,
                        partners: data._embedded.partners
                    })
                })

                .catch(function (error) {
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
    }, [project]);

    return {...hookState, load: load};
}
