import React, { useRef, useCallback } from 'react'
import { useApi, apiStates, iApiError } from 'hooks/api/useApi';
import { Partner } from "interface/project/partner";
// import { fromFilter } from 'function/api/filter-functions';

export { ApiError, apiStates } from 'hooks/api/useApi';

// interface ProjectResponse {
//     _embedded: {
//         projects: Array<Project>
//     }
//     page_count: number
//     page_size: number
//     total_items: number
//     page: number
// }

interface State {
    state: string,
    error?: iApiError,
    partners: Array<Partner>,
    pageCount?: number,
    pageSize?: number,
    totalItems?: number,
    page?: number
}

interface Props {
    filter?: string,
    page: number,
    pageSize: number,
    sort?: string,
    order?: string,
}

const defaultProps = {
    page: 1,
    pageSize: 10
}

export function usePartners(queryParameter: Props = { filter: '', page: defaultProps.page, pageSize: defaultProps.pageSize }, requestOptions = {}) {

    // const filter = queryParameter.filter;
    const fetchData = useApi('/statistics/results/partner', queryParameter, requestOptions);
    
    const mountedRef = useRef(true);

    const [hookState, setHookState] = React.useState<State>({
        state: apiStates.LOADING,
        partners: []
    });

    const load = useCallback(async (queryParameter: Props, requestOptions = {}) => {
        const setPartData = (partialData: {
            state: string,
            partners?: Array<Partner>,
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

        // has to be removed otherwise it will re-render the complete page maybe add different states for re-query e.g. because of sorting / pagination ?
        // must be removed otherwise datatable pagination doesn't work
        // setPartData({
        //     state: apiStates.LOADING,
        //     partners: []
        // })


        try {
            // const data = await <Response>fetchData(queryParameter, requestOptions)  // doesn't work don't know how the interface could be used.
            const data = await fetchData(queryParameter, requestOptions)
            setPartData({
                state: apiStates.SUCCESS,
                partners: data._embedded.partners,
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

        // if (queryParameter.filter) {
        //     const hash = fromFilter(queryParameter.filter);
        //     const newFilter = JSON.parse(hash);
        // }

        load(queryParameter, requestOptions);

        // important unload of unmounted component
        return () => {
            mountedRef.current = false
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load, queryParameter.filter, mountedRef]); 

    // constant query ... when queryParameter or requestOptions are added.
    // }, [load, queryParameter.filter, mountedRef, queryParameter, requestOptions]); 
    
    return { ...hookState, load: load };
}
