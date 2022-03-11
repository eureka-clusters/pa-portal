import React, { useRef, useCallback } from 'react'
import { useApi, apiStates, iApiError } from 'hooks/api/useApi';
import { Project } from "interface/project";

export { ApiError, apiStates } from 'hooks/api/useApi';

interface State {
    state: string,
    error?: iApiError,
    project: Project,
}

interface Props {
    slug: string,
}

export function useProject(queryParameter: Props, requestOptions = {}) {   

    let url = '/view/project/{slug}';
    
    const fetchData = useApi(url, queryParameter, requestOptions, { tokenMethod: 'jwt', tokenRequired: true, parseUrl: true });

    const mountedRef = useRef(true);

    const [hookState, setHookState] = React.useState<State>({
        state: apiStates.LOADING,
        project: {} as Project
    });
    
    const load = useCallback(async (queryParameter: Props, requestOptions = {}) => {
        const setPartData = (partialData: {
            state: string,
            project?: Project,
            error?: iApiError,
        }) => {
            // Before setState ensure that the component is mounted, otherwise return null and don't allow to unmounted component.
            if (!mountedRef.current) return null;
            setHookState(hookState => ({ ...hookState, ...partialData }))
        }

        try {
            // const data = await <Response>fetchData(queryParameter, requestOptions)  // doesn't work don't know how the interface could be used.
            const data = await fetchData(queryParameter, requestOptions)
            setPartData({
                state: apiStates.SUCCESS,
                project: data,
            })
        } catch (error: any) {
            setPartData({
                state: apiStates.ERROR,
                error: error
            });
        }
    }, [mountedRef, fetchData]);

    React.useEffect(() => {
        mountedRef.current = true;
        load(queryParameter, requestOptions);

        // important unload of unmounted component
        return () => {
            mountedRef.current = false
        }

        // why can't i add properties to the "dependecies" ... (sorting etc. doen't work with it..)
        // "load" could be added if its a callback. but still can't get rid of these warnings...

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load, mountedRef]);


    return { ...hookState, load: load };
}

