import {useContext, useEffect, useReducer, useState} from 'react'
import dataFetchReducer from "@/hooks/data-fetch-reducer";
import {createSearchParams} from "react-router-dom";
import {AxiosContext} from '@/providers/axios-provider';
import {FilterOptions, ListResponse} from '@/functions/filter-functions';
import {Organisation} from "@/interface/organisation";

export const useGetOrganisations = ({filterOptions}: { filterOptions: FilterOptions }) => {

    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: true,
        isError: false,
        data: [],
    });

    const axiosContext = useContext(AxiosContext);

    filterOptions.pageSize = '100';

    const [localFilterOptions, setLocalFilterOptions] = useState<FilterOptions>(filterOptions);

    useEffect(() => {
        let didCancel = false;

        const fetchData = async () => {
            dispatch({type: 'FETCH_INIT'});

            try {
                const controller = new AbortController();

                let url = 'list/organisation?' + createSearchParams(localFilterOptions).toString();

                const result = await axiosContext.authAxios.get(url, {signal: controller.signal});

                if (!didCancel) {

                    let payload: ListResponse<Organisation> = {
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
