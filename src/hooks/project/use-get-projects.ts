import {useContext, useEffect, useReducer, useState} from 'react'
import dataFetchReducer from "@/hooks/data-fetch-reducer";
import {createSearchParams} from "react-router-dom";
import {AxiosContext} from '@/providers/axios-provider';
import {FilterOptions, ListResponse} from '@/functions/filter-functions';
import {Project} from "@/interface/project";

export const useGetProjects = ({filterOptions}: { filterOptions: FilterOptions }) => {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: true,
        isError: false,
        data: [],
    });

    const axiosContext = useContext(AxiosContext);

    const [localFilterOptions, setLocalFilterOptions] = useState<FilterOptions>(filterOptions);

    useEffect(() => {
        let didCancel = false;

        const fetchData = async () => {
            dispatch({type: 'FETCH_INIT'});

            try {
                const controller = new AbortController();

                let url = 'list/project?' + createSearchParams(localFilterOptions).toString();

                const result = await axiosContext.authAxios.get(url, {signal: controller.signal});

                if (!didCancel) {

                    let payload: ListResponse<Project> = {
                        items: result.data._embedded.items,
                        page: result.data.page,
                        page_count: result.data.page_count,
                        total_items: result.data.total_items,
                    }

                    dispatch({type: 'FETCH_SUCCESS', payload: payload});
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

    }, [localFilterOptions]);

    return {state, setLocalFilterOptions};
}
