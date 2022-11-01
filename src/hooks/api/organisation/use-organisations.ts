import React, {useCallback} from 'react'
import {Organisation} from "interface/organisation";
import {ApiError} from "interface/api/api-error";
import {ApiStates} from 'hooks/api/api-error';
import {createSearchParams} from "react-router-dom";
import axios from "axios";

interface State {
    state: string,
    error?: ApiError,
    organisations: Array<Organisation>,
    pageCount?: number,
    pageSize?: number,
    totalItems?: number,
    page?: number
}

interface OrganisationResponse {
    _embedded: {
        organisations: Array<Organisation>
    }
    page_count: number,
    page_size: number,
    total_items: number,
    page: number
}


export function useOrganisations(queryParameter: any) {

    const [hookState, setHookState] = React.useState<State>({
        state: ApiStates.LOADING,
        organisations: []
    });

    const load = useCallback(async (queryParameter: any) => {
        const setPartData = (partialData: {
            state: string,
            organisations?: Array<Organisation>,
            error?: ApiError,
            pageCount?: number,
            pageSize?: number,
            totalItems?: number,
            page?: number
        }) => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }


        try {

            const abortController = new AbortController();

            let url = '/list/organisation?' + createSearchParams(queryParameter).toString();
            axios.create().get<OrganisationResponse>(url, {
                signal: abortController.signal
            }).then(response => {

                const {data} = response;

                setPartData({
                    state: ApiStates.SUCCESS,
                    organisations: data._embedded.organisations,
                    pageCount: data.page_count,
                    pageSize: data.page_size,
                    totalItems: data.total_items,
                    page: data.page
                })
            });

            return () => {
                abortController.abort();
            }

        } catch (error: any) {
            setPartData({
                state: ApiStates.ERROR,
                error: error
            });
        }


    }, []);

    React.useEffect(() => {
        // load(queryParameter);
    }, [queryParameter]);


    return {...hookState, load: load};
}
