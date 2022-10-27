import React, {useCallback} from 'react'
import {Partner} from "interface/project/partner";
import {ApiError} from "interface/api/api-error";
import {ApiStates} from 'hooks/api/api-error';
import axios from "axios";

interface State {
    state: string,
    error?: ApiError,
    partners: Array<Partner>,
    pageCount?: number,
    pageSize?: number,
    totalItems?: number,
    page?: number
}

export interface PartnerResponse {
    _embedded: {
        partners: Array<Partner>
    }
    page_count: number,
    page_size: number,
    total_items: number,
    page: number
}


export function usePartners(queryParameter: any) {

    const [hookState, setHookState] = React.useState<State>({
        state: ApiStates.LOADING,
        partners: []
    });

    const load = useCallback(async (queryParameter: any, requestOptions = {}) => {


        const setPartData = (partialData: {
            state: string,
            partners?: Array<Partner>,
            error?: ApiError,
            pageCount?: number,
            pageSize?: number,
            totalItems?: number,
            page?: number
        }) => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        try {

            let url = '/list/partner';
            axios.create().get<PartnerResponse>(url, requestOptions)
                .then(response => {
                    const {data} = response;
                    setPartData({
                        state: ApiStates.SUCCESS,
                        partners: data._embedded.partners,
                        pageCount: data.page_count,
                        pageSize: data.page_size,
                        totalItems: data.total_items,
                        page: data.page
                    })
                });


        } catch (error: any) {
            setPartData({
                state: ApiStates.ERROR,
                error: error
            });
        }
    }, []);

    React.useEffect(() => {
        load(queryParameter).then(() => {
            return
        });
    }, [queryParameter]);


    return {...hookState, load: load};
}
