import React, {useCallback} from 'react'
import axios from "axios";
import {ApiError} from "interface/api/api-error";
import {ApiStates} from 'hooks/api/api-error';

export interface SearchResult {
    id: number,
    slug: string,
    name: string,
}

interface SearchResponse {
    _embedded: {
        search: Array<SearchResult>
    },
    page_count: number,
    page_size: number,
    total_items: number,
    page: number

}

interface State {
    state: string,
    error?: ApiError,
    results: Array<SearchResult>,
    pageCount?: number,
    pageSize?: number,
    totalItems?: number,
    page?: number
}

interface Props {
    query: string,
    page: number,
    pageSize?: number,
    sort?: string,
    order?: string,
}

export function useSearch(queryParameter: Props) {


    const [hookState, setHookState] = React.useState<State>({
        state: ApiStates.LOADING,
        results: []
    });

    const load = useCallback(async (queryParameter: Props) => {

        let url = '/search/result';
        const setPartData = (partialData: {
            state: string,
            results?: Array<SearchResult>,
            error?: ApiError,
            pageCount?: number,
            pageSize?: number,
            totalItems?: number,
            page?: number
        }) => {
            // Before setState ensure that the component is mounted, otherwise return null and don't allow to unmounted component.
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        try {

            url = url + '?query=' + queryParameter.query;

            axios.create().get<SearchResponse>(url)
                .then(response => {
                    const {data} = response;

                    setPartData({
                        state: ApiStates.SUCCESS,
                        results: data._embedded.search,
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
    }, [queryParameter]);

    React.useEffect(() => {
        load(queryParameter).then(() => {
            return;
        });

    }, [load]);


    return {...hookState, load: load};
}
