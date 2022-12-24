import {useContext, useEffect, useReducer} from 'react'
import axios from 'axios';
import dataFetchReducer from "hooks/data-fetch-reducer";
import {Project} from "interface/project";
import { AxiosContext } from 'providers/axios-provider';

export const useGetOrganisation = (slug: string) => {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: true,
        isError: false,
        data: null,
    });

    const axoisContext = useContext(AxiosContext);

    useEffect(() => {
        let didCancel = false;

        const fetchData = async () => {
            dispatch({type: 'FETCH_INIT'});

            try {
                const controller = new AbortController();

                let url = 'view/organisation/' + slug

                const result = await axoisContext.authAxios.get(url, {signal: controller.signal});

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
