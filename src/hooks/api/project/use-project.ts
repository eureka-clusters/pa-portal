import React, {useCallback, useEffect} from 'react'
import axios from 'axios';
import {Project} from 'interface/project';
import {ApiError} from "interface/api/api-error";
import {ApiStates} from 'hooks/api/api-error';

interface State {
    state: string,
    error?: ApiError,
    project: Project,
}

export function useProject(slug: string) {

    const [hookState, setHookState] = React.useState<State>({
        state: ApiStates.LOADING,
        project: {} as Project
    });

    const load = useCallback(async (slug: string, requestOptions = {}) => {
        let url = '/view/project/' + slug;

        const setPartData = (partialData: {
            state: string,
            project?: Project,
            error?: ApiError,
        }) => {

            setHookState(hookState => ({...hookState, ...partialData}))
        }

        setPartData({
            state: ApiStates.LOADING,
            project: {} as Project
        })

        axios.create().get<Project>(url, requestOptions)
            .then(response => {

                const {data} = response;

                setPartData({
                    state: ApiStates.SUCCESS,
                    project: data
                })
            })
    }, []);

    useEffect(() => {
        load(slug).then(() => {
            return;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);


    return {...hookState, load: load};
}

