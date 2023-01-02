import {useContext, useEffect, useReducer} from 'react'
import dataFetchReducer from "@/hooks/data-fetch-reducer";
import {AxiosContext} from "@/providers/axios-provider";

export const useGetProject = (slug: string) => {
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

                let url = 'view/project/' + slug

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
