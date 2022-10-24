import React, {useCallback} from 'react'
import {Organisation} from "interface/organisation";
import {ApiError} from "interface/api/api-error";
import {ApiStates} from 'hooks/api/api-error';
import {PaginationProps} from "interface/api/pagination-props";
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


export function useOrganisations(queryParameter: PaginationProps) {

    const [hookState, setHookState] = React.useState<State>({
        state: ApiStates.LOADING,
        organisations: []
    });

    const load = useCallback(async (queryParameter: PaginationProps, requestOptions = {}) => {


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

            let url = '/list/organisation';

            axios.create().get<OrganisationResponse>(url, requestOptions)
                .then(response => {

                    const {data} = response;

                    setPartData({
                        state: ApiStates.SUCCESS,
                        organisations: data._embedded.organisations,
                        pageCount: data.page_count,
                        pageSize: data.page_size,
                        totalItems: data.total_items,
                        page: data.page
                    })
                })


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
