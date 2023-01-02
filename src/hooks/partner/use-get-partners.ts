import {useContext, useEffect, useReducer, useState} from 'react'
import dataFetchReducer from "@/hooks/data-fetch-reducer";
import {createSearchParams} from "react-router-dom";
import {AxiosContext} from '@/providers/axios-provider';
import {FilterOptions, ListResponse} from '@/functions/filter-functions';
import {Organisation} from '@/interface/organisation';
import {Project} from '@/interface/project';
import {Partner} from "@/interface/project/partner";

export const useGetPartners = ({filterOptions, organisation, project}: {
    filterOptions: FilterOptions, organisation?: Organisation, project?: Project
}) => {
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

                let url = 'list/partner?' + createSearchParams(localFilterOptions).toString();

                if (organisation !== undefined) {
                    url += '&organisation=' + organisation.slug;
                }
                if (project !== undefined) {
                    url += '&project=' + project.slug;
                }

                const result = await axiosContext.authAxios.get(url, {signal: controller.signal});

                if (!didCancel) {

                    let payload: ListResponse<Partner> = {
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
