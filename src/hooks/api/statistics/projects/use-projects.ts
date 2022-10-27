import React, {useCallback} from 'react'
import {ApiError} from "interface/api/api-error";
import {ApiStates} from 'hooks/api/api-error';
import {Project} from "interface/project";
import axios from "axios";
import {ProjectResponse} from "hooks/api/project/use-projects";
import {createSearchParams} from "react-router-dom";


interface State {
    state: string,
    error?: ApiError,
    projects: Array<Project>,
    pageCount?: number,
    pageSize?: number,
    totalItems?: number,
    page?: number
}

const defaultProps = {
    page: 1,
    pageSize: 10
}

export function useProjects(queryParameter: any = {
    filter: '',
    page: defaultProps.page,
    pageSize: defaultProps.pageSize
}) {

    const [hookState, setHookState] = React.useState<State>({
        state: ApiStates.LOADING,
        projects: []
    });

    const load = useCallback(async (queryParameter: any) => {
        const setPartData = (partialData: {
            state: string,
            projects?: Array<Project>,
            error?: ApiError,
            pageCount?: number,
            pageSize?: number,
            totalItems?: number,
            page?: number
        }) => {
            // Before setState ensure that the component is mounted, otherwise return null and don't allow to unmounted component.
            setHookState(hookState => ({...hookState, ...partialData}))
        }


        try {


            const url = '/statistics/results/project?' + createSearchParams(queryParameter).toString();

            axios.create().get<ProjectResponse>(url)
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
                })

        } catch (error: any) {
            setPartData({
                state: ApiStates.ERROR,
                error: error
            });
        }
    }, [queryParameter]);

    // React.useEffect(() => {
    //
    //     load(queryParameter).then(() => {
    //         return;
    //     });
    //
    // }, [load, queryParameter]);

    return {...hookState, load: load};
}
