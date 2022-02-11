import React, { useRef, useCallback } from 'react'
import { useApi, apiStates } from 'hooks/api/useApi';
import { Partner } from "interface/project/partner";

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
    error?: string,
    partners: Array<Partner> | undefined,
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
        error: '',
        partners: undefined
    });

    const load = useCallback(async (queryParameter: Props, requestOptions = {}) => {
        const setPartData = (partialData: {
            state: string,
            partners?: Array<Partner>,
            error?: string,
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
        // setPartData({
        //     state: apiStates.LOADING,
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


    // const load = (queryParameter: Props, requestOptions = {}) => {
    //     const setPartData = (partialData: {
    //         state: string,
    //         partners?: Array<Partner>,
    //         error?: string,
    //         pageCount?: number,
    //         pageSize?: number,
    //         totalItems?: number,
    //         page?: number
    //     }) => {
    //         // Before setState ensure that the component is mounted, otherwise return null and don't allow to unmounted component.
    //         if (!mountedRef.current) return null;
    //         // console.log(['mountedRef.current', mountedRef.current]);
    //         setHookState(hookState => ({ ...hookState, ...partialData }))
    //     }

    //     const fetchAsync = async () => {
    //         try {
    //             const data = await fetchData(queryParameter, requestOptions)
    //             setPartData({
    //                 state: apiStates.SUCCESS,
    //                 partners: data._embedded.partners,
    //                 pageCount: data.page_count,
    //                 pageSize: data.page_size,
    //                 totalItems: data.total_items,
    //                 page: data.page
    //             })
    //         } catch (error: any) {
                
    //             console.log('error catched', error);
    //             setPartData({
    //                 state: apiStates.ERROR,
    //                 error: error
    //             });
    //         }
    //     }
    //     fetchAsync();
    // }


    React.useEffect(() => {
        mountedRef.current = true;
        if (queryParameter.filter) {
            const hash = atob(queryParameter.filter);
            const newFilter = JSON.parse(hash);
            console.log(['filter test', newFilter]);
        }

        load(queryParameter, requestOptions);

        // important unload of unmounted component
        return () => {
            console.log('unload in useProject');
            mountedRef.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [load, mountedRef]); 
    // }, [load, queryParameter.filter, mountedRef]);  
    }, [load, queryParameter.filter, mountedRef]); 
    // }, [queryParameter.filter, mountedRef]); 
    

    return { ...hookState, load: load };
}
