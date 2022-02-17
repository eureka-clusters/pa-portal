import React, { useRef, useCallback}  from 'react'
import { useApi, apiStates, iApiError} from 'hooks/api/useApi';

export { apiStates } from 'hooks/api/useApi';

interface Me {
    email: string,
    first_name: string,
    last_name: string, 
    funder_clusters: Array<string>
    funder_country: string,
    id: number,
    is_funder: boolean,
    _links: any,
}

interface Props {
    // filter?: string,
    // page: number,
    // pageSize: number,
    // sort?: string,
    // order?: string,
}

interface State {
    state: string,
    error?: iApiError,
    data: Me | undefined,
    // data: any
}

export function useMe(queryParameter: Props , requestOptions = {}) {

    const fetchData = useApi('/me', queryParameter, requestOptions);

    const mountedRef = useRef(true);

    const [hookState, setHookState] = React.useState <State> ({
        state: apiStates.LOADING,
        data: undefined
        // data: {} as Me
    });

    const load = useCallback(async (queryParameter: Props, requestOptions = {}) => {

        const setPartData = (partialData: {
            state: string;
            data?: Me;
            error?: iApiError;
        }) => {
            // Before setState ensure that the component is mounted, otherwise return null and don't allow to unmounted component.
            if (!mountedRef.current) return null;
            setHookState(hookState => ({ ...hookState, ...partialData }))
        }

        setPartData({
            state: apiStates.LOADING,
        })

        try {
            const data = await fetchData(queryParameter, requestOptions)
            setPartData({
                state: apiStates.SUCCESS,
                data: data
            })
        } catch (error: any) {

            console.log('error catched', error);
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
            console.log('when is this called useMe_mountedRef_withCallback');
            mountedRef.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load, mountedRef]);

    return { ...hookState, load: load };
}
