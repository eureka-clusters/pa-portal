import {useEffect, useReducer} from 'react'
import axios from 'axios';
import dataFetchReducer from "hooks/data-fetch-reducer";
import {createSearchParams} from "react-router-dom";
import {Organisation} from "interface/organisation";
import {Project} from "interface/project";
import {FilterValues} from "interface/statistics/filter-values";

export const useGetPartners = ({
                                   organisation,
                                   project: project,
                                   filter,
                                   page,
                                   pageSize,
                                   sort,
                                   order
                               }: {
    organisation?: Organisation,
    project?: Project,
    filter?: FilterValues,
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
        filter: btoa(JSON.stringify(filter)),
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

                let url = 'list/partner?' + createSearchParams(queryParameter).toString();

                if (organisation !== undefined) {
                    url += '&organisation=' + organisation.slug;
                }
                if (project !== undefined) {
                    url += '&project=' + project.slug;
                }

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
