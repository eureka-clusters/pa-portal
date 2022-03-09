import React from 'react';
import { useAuth} from "context/user-context";
import axios from 'axios';
import {apiStates, GetServerUri} from "function/api/index";
import {Partner} from "interface/project/partner";
import {Project} from "interface/project";
import {Organisation} from "interface/organisation";

export {apiStates} from 'function/api/index';
export {ApiError} from 'function/api/index';

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

interface Props {
    project?: Project,
    organisation?: Organisation,
    filter?: string,
    page?: number,
    pageSize?: number,
    sort?: string,
    order?: string,
}

// default properties for page and pageSize
const defaultProps = {
    page: 1,
    pageSize: -1,
    filter: '',
    project: undefined,
    organisation: undefined,
}


export const GetPartners = (params: Props) => {
    params = { ...defaultProps, ...params }

    let auth = useAuth();
    const serverUri = GetServerUri();
    let jwtToken = auth.getJwtToken();

    const [hookState, setHookState] = React.useState<PartnerState>({
        state: apiStates.LOADING,
        error: '',
        partners: []
    });

    const load = (params: Props) => {
        const setPartData = (partialData: { state: string; partners?: Array<Partner>; error?: string; }) => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        let url = 'list/partner';
        if (typeof params.project !== 'undefined') {
            url = 'list/partner?project=' + params.project.slug + '&pageSize= '+ params.pageSize;
        }
        if (typeof params.organisation !== 'undefined') {
            url = 'list/partner?organisation=' + params.organisation.slug + '&pageSize=' + params.pageSize;
        }

        axios.create({
            baseURL: serverUri + '/api',
            timeout: 5000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        }).get<PartnerResponse>(url, {
            
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
    };

    React.useEffect(() => {
        load(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.project, params.organisation]);

    return {...hookState, load: load};
}
