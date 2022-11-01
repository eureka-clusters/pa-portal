import React, {useCallback} from 'react'
import {Project} from "interface/project";
import {ApiError} from "interface/api/api-error";
import {ApiStates} from 'hooks/api/api-error';
import {createSearchParams} from "react-router-dom";
import axios from "axios";

interface State {
    state: string,
    error?: ApiError,
    projects: Array<Project>,
    pageCount?: number,
    pageSize?: number,
    totalItems?: number,
    page?: number
}


export interface ProjectResponse {
    _embedded: {
        projects: Array<Project>
    }
    page_count: number,
    page_size: number,
    total_items: number,
    page: number
}


export function useProjects(page: number, pageSize: number, sort: string, order: string) {

    const [hookState, setHookState] = React.useState<State>({
        state: ApiStates.LOADING,
        projects: []
    });

    const load = useCallback(async () => {


        const setPartData = (partialData: {
            state: string,
            projects?: Array<Project>,
            error?: ApiError,
            pageCount?: number,
            pageSize?: number,
            totalItems?: number,
            page?: number
        }) => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        try {

            const queryParameter = {
                page: page.toString(),
                pageSize: pageSize.toString(),
                sort: sort,
                order: order
            };

            let url = '/list/project?' + createSearchParams(queryParameter).toString();

            const abortController = new AbortController();

            axios.create().get<ProjectResponse>(url, {signal: abortController.signal})
                .then(response => {

                    const {data} = response;

                    setPartData({
                        state: ApiStates.SUCCESS,
                        projects: data._embedded.projects,
                        pageCount: data.page_count,
                        pageSize: data.page_size,
                        totalItems: data.total_items,
                        page: data.page
                    })
                });

            return () => {
                abortController.abort();
            }

        } catch (error: any) {
            setPartData({
                state: ApiStates.ERROR,
                error: error
            });
        }
    }, []);

    // React.useEffect(() => {
    //     load(queryParameter).then(() => {
    //         return
    //     });
    // }, [queryParameter]);


    return {...hookState, load: load};
}
