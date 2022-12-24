import { useEffect, useReducer, useContext, useState } from 'react'
import dataFetchReducer from "hooks/data-fetch-reducer";
import { createSearchParams } from "react-router-dom";
import { AxiosContext } from 'providers/axios-provider';
import { FilterOptions } from 'functions/filter-functions';

export const useGetProjects = ({ filterOptions }: { filterOptions: FilterOptions }) => {
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
            dispatch({ type: 'FETCH_INIT' });

            try {
                const controller = new AbortController();

                let url = 'list/project?' + createSearchParams(filterOptions).toString();

                const result = await axiosContext.authAxios.get(url, { signal: controller.signal });

                if (!didCancel) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
                }

                controller.abort();

            } catch (error: any) {
                if (!didCancel) {
                    dispatch({ type: 'FETCH_FAILURE' });
                }
            }
        };

        fetchData();

        return () => {
            didCancel = true;
        };

    }, [localFilterOptions]);

    return { state, setLocalFilterOptions };
}
