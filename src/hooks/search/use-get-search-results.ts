import {useEffect, useReducer} from 'react'
import axios from 'axios';
import dataFetchReducer from "@/hooks/data-fetch-reducer";
import {Project} from "@/interface/project";
import {createSearchParams} from "react-router-dom";

export const useGetSearchResults = ({
                                   query,
                                   page,
                                   pageSize,
                                   sort,
                                   order
                               }: {
    query: string,
    page?: number,
    pageSize?: number,
    sort?: string,
    order?: string
}) => {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: true,
        isError: false,
        data: [],
    });

    const queryParameter = {
        query: query,
        page: page ? page.toString() : '1',
        pageSize: pageSize ? pageSize.toString() : '50',
        sort: sort ?? 'default',
        order: order ?? 'asc'
    };

    useEffect(() => {
        let didCancel = false;

        const fetchData = async () => {
            dispatch({type: 'FETCH_INIT'});

            try {
                const controller = new AbortController();

                let url = 'search/result?' + createSearchParams(queryParameter).toString();

                const result = await axios.get(url, {signal: controller.signal});

                if (!didCancel) {
                    dispatch({type: 'FETCH_SUCCESS', payload: result.data});
                }

                controller.abort();

            } catch (error: any) {
                if (!didCancel) {
                    dispatch({type: 'FETCH_FAILURE'});
                }
            }
        };

        fetchData();

        return () => {
            didCancel = true;
        };

    }, []);

    return {state};
}
