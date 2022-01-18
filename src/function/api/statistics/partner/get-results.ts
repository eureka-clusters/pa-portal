import React from 'react';
import {useAuth} from "context/user-context";
import axios from 'axios';
import {apiStates, GetServerUri} from "function/api/index";
import {Partner} from "interface/project/partner";

interface PartnerResponse {
    _embedded: {
        partners: Array<Partner>
    }
    page_count: number
    page_size: number
    total_items: number
    page: number
}

interface PartnerState {
    state: string,
    error?: string,
    partners: Array<Partner>,
    pageCount?: number,
    pageSize?: number,
    totalItems?: number,
    page?: number
}

interface Props {
    filter: string,
    page: number,
    pageSize: number,
    sort?: string,
    order?: string,
}

// default properties for page and pageSize
const defaultProps = {
    page: 1,
    pageSize: 10
}

export const GetResults = (params: Props = { filter: '', page: defaultProps.page, pageSize: defaultProps.pageSize }) => {

    let auth = useAuth();
    const serverUri = GetServerUri();
    let jwtToken = auth.getJwtToken();

    const [hookState, setHookState] = React.useState<PartnerState>({
        state: apiStates.LOADING,
        error: '',
        partners: []
    });

    const load = (params: Props) => {

        const setPartData = (partialData: {
            state: string,
            partners?: Array<Partner>,
            error?: string,
            pageCount?: number,
            pageSize?: number,
            totalItems?: number,
            page?: number
        }) => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        axios.create({
            baseURL: serverUri + '/api',
            timeout: 5000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        }).get<PartnerResponse>('/statistics/results/partner', {
            params: params
            // settings could be overwritten
            // timeout: 1000
        })
            .then(response => {
                //Use a local const to have the proper TS typehinting
                const {data} = response;

                setPartData({
                    state: apiStates.SUCCESS,
                    partners: data._embedded.partners,
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
    };

    React.useEffect(() => {
        load(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.filter]);

    return {...hookState, load: load};
}
