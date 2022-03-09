import React, { useRef, useCallback } from 'react'
import { useApi, apiStates, iApiError } from 'hooks/api/useApi';

import { Facets } from "interface/statistics/project/facets";

export { ApiError, apiStates } from 'hooks/api/useApi';


interface State {
    state: string,
    error?: iApiError,
    facets: Facets,
    // facets: Facets
}

interface Props {
    filter?: string,
}

export function useFacets(queryParameter: Props = { filter: '' }, requestOptions = {}) {

    // const filter = queryParameter.filter;
    // const fetchData = useApi(`/statistics/facets/project/${filter}`, queryParameter, requestOptions);

    const fetchData = useApi("/statistics/facets/partner/{filter}", queryParameter, requestOptions, { tokenMethod: 'jwt', tokenRequired:true, parseUrl:true }); // how can i change it that i don't have to add all parameters?
    
    const mountedRef = useRef(true);

    const [hookState, setHookState] = React.useState<State>({
        state: apiStates.LOADING,
        // facets: undefined
        facets: {} as Facets
    });


    const load = useCallback(async (queryParameter: Props, requestOptions = {}) => {
        const setPartData = (partialData: {
            state: string,
            facets?: Facets,
            error?: iApiError
        }) => {
            // Before setState ensure that the component is mounted, otherwise return null and don't allow to unmounted component.
            if (!mountedRef.current) return null;
            setHookState(hookState => ({ ...hookState, ...partialData }))
        }

        // has to be removed otherwise it will re-render the complete page maybe add different states for re-query e.g. because of sorting / pagination ?
        // setPartData({
        //     state: apiStates.LOADING,
        // })

        try {
            // const data = await <Response>fetchData(queryParameter, requestOptions)  // doesn't work don't know how the interface could be used.
            const data = await fetchData(queryParameter, requestOptions)
            setPartData({
                state: apiStates.SUCCESS,
                facets: data,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParameter.filter, load, mountedRef]);  

    return { ...hookState, load: load };
}
