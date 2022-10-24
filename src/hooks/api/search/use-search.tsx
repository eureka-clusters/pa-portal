import React, { useRef, useCallback } from 'react'
import { useApi, apiStates, iApiError  } from 'hooks/api/useApi';
export { ApiError, apiStates } from 'hooks/api/useApi';

export interface SearchResult {
    id: number,
    slug: string,
    name: string,
}

interface State {
    state: string,
    error?: iApiError,
    results: Array<SearchResult>,
    pageCount?: number,
    pageSize?: number,
    totalItems?: number,
    page?: number
}

interface Props {
    query: string,
    page: number,
    pageSize?: number,
    sort?: string,
    order?: string,
}

// default properties for page and pageSize
const defaultProps = {
    query: '',
    page: 1,
    pageSize: 10,
}

export function useSearch(queryParameter: Props , requestOptions = {}) {   
    queryParameter = { ...defaultProps, ...queryParameter }

    let url = '/search/result';
   
    const fetchData = useApi(url, queryParameter, requestOptions);

    const mountedRef = useRef(true);

    const [hookState, setHookState] = React.useState<State>({
        state: apiStates.LOADING,
        results: []
    });

    const load = useCallback(async (queryParameter: Props, requestOptions = {}) => {
        const setPartData = (partialData: {
            state: string,
            results?: Array<SearchResult>,
            error?: iApiError,
            pageCount?: number,
            pageSize?: number,
            totalItems?: number,
            page?: number
        }) => {
            // Before setState ensure that the component is mounted, otherwise return null and don't allow to unmounted component.
            if (!mountedRef.current) return null;
            setHookState(hookState => ({ ...hookState, ...partialData }))
        }

        // must be removed otherwise datatable pagination doesn't work
        // setPartData({
        //     state: apiStates.LOADING,
        //     organisations: []
        // })

        try {
            // const data = await <Response>fetchData(queryParameter, requestOptions)  // doesn't work don't know how the interface could be used.
            const data = await fetchData(queryParameter, requestOptions)
            setPartData({
                state: apiStates.SUCCESS,
                results: data._embedded.search,
                pageCount: data.page_count,
                pageSize: data.page_size,
                totalItems: data.total_items,
                page: data.page
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

        if (queryParameter.query) {
            load(queryParameter, requestOptions);
        }
        

        // important unload of unmounted component
        return () => {
            mountedRef.current = false
        }
        // why can't i add properties to the "dependecies" ... (sorting etc. doen't work with it..)
        // "load" could be added if its a callback. but still can't get rid of these warnings...
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load, mountedRef]);  // only works if load is a callback but still says properties is dependend
    // }, [mountedRef]); // works if load is a function (load couldn't be added if its not a callback)
    // }, [load, mountedRef, properties]);  // sort etc. doesn't work...

    return { ...hookState, load: load };
}
