import {useEffect, useReducer} from 'react'
import axios from 'axios';
import dataFetchReducer from "hooks/data-fetch-reducer";
import {createSearchParams} from "react-router-dom";
import {FilterValues} from "interface/statistics/filter-values";

export const useGetProjects = ({
                                   filter,
                                   page,
                                   pageSize,
                                   sort,
                                   order
                               }: {
    filter: FilterValues,
    page: number,
    pageSize: number,
    sort: string,
    order: string
}) => {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: true,
        isError: false,
        data: [],
    });

    const queryParameter = {
        filter: btoa(JSON.stringify(filter)),
        page: page.toString(),
        pageSize: pageSize.toString(),
        sort: sort,
        order: order
    };

    useEffect(() => {
        let didCancel = false;

        const fetchData = async () => {
            dispatch({type: 'FETCH_INIT'});

            try {
                const controller = new AbortController();

                let url = 'list/project?' + createSearchParams(queryParameter).toString();

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
