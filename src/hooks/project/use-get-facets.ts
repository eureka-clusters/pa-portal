import {useContext, useEffect, useReducer} from 'react'
import dataFetchReducer from "@/hooks/data-fetch-reducer";
import {AxiosContext} from "@/providers/axios-provider";

export const useGetProjectFacets = (filter: any) => {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: true,
        isError: false,
        data: null,
    });

    const axiosContext = useContext(AxiosContext);

    useEffect(() => {
        let didCancel = false;

        const fetchData = async () => {
            dispatch({type: 'FETCH_INIT'});

            try {
                const controller = new AbortController();

                const url = "/statistics/facets/project/" + btoa(JSON.stringify(filter));

                const result = await axiosContext.authAxios.get(url, {signal: controller.signal});

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
