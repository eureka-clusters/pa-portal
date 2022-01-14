import React from 'react';
import { useAuth} from "context/user-context";
import axios from 'axios';
import {apiStates, GetServerUri} from 'function/api/index';
import {Organisation} from "interface/organisation";

export {apiStates} from 'function/api/index';
export {ApiError} from 'function/api/index';

interface OrganisationResponse {
    _embedded: {
        organisations: Array<Organisation>
    }
    page_count: number
    page_size: number
    total_items: number
    page: number
}

interface OrganisationState {
    state: string;
    error?: string
    organisations: Array<Organisation>

    pageCount?: number,
    pageSize?: number,
    totalItems?: number,
    page?: number
}


interface Props {
    page: number;
    pageSize: number;
}

// default properties for page and pageSize
const defaultProps = {
    page: 1,
    pageSize: 10
}

export const GetOrganisations = (params: Props = { page: defaultProps.page, pageSize: defaultProps.pageSize }) => {

    let auth = useAuth();
    const serverUri = GetServerUri();
    let jwtToken = auth.getJwtToken();

    const [hookState, setHookState] = React.useState<OrganisationState>({
        state: apiStates.LOADING,
        error: '',
        organisations: []
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

    const load = (params: Props) => {

        const setPartData = (partialData: {
            state: string,
            organisations?: Array<Organisation>,
            error?: string,
            pageCount?: number,
            pageSize?: number,
            totalItems?: number,
            page?: number
        }) => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        createInstance().then(axios => {
            // axios automatically returns json in response.data and catches errors 
            axios.get<OrganisationResponse>('list/organisation', {
                params: params
                // settings could be overwritten
                // timeout: 1000
            })
                .then(response => {
                    //Use a local const to have the proper TS typehinting
                    const {data} = response;

                    setPartData({
                        state: apiStates.SUCCESS,
                        organisations: data._embedded.organisations,
                        
                        // set the values which come from the paginated values
                        pageCount: data.page_count,
                        pageSize: data.page_size,
                        totalItems: data.total_items,
                        page: data.page
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
        load(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {...hookState, load: load};
}
