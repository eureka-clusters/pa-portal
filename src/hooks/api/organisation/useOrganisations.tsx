import React, { useRef, useCallback } from 'react'
import { useApi, apiStates, iApiError  } from 'hooks/api/useApi';
import { Organisation } from "interface/organisation";

export { ApiError, apiStates } from 'hooks/api/useApi';



interface Response {
    _embedded: {
        organisations: Array<Organisation>
    }
    page_count: number
    page_size: number
    total_items: number
    page: number
}

interface State {
    state: string,
    error?: iApiError | undefined,
    organisations: Array<Organisation> | undefined,
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

// default properties for page and pageSize
const defaultProps = {
    page: 1,
    pageSize: 10
}


export function useOrganisations(queryParameter: Props = {  filter: '', page: defaultProps.page, pageSize: defaultProps.pageSize }, requestOptions = {}) {   


    // doens't work if the given url isn't a complete url.
    // var QueryUrl = new URL('/list/organisation');
    // // add query params to the url
    // if (properties !== undefined) {
    //     QueryUrl.search = new URLSearchParams(properties as any).toString();
    //     // remove params from options otherwise they would be in the headers.
    //     console.log(['QueryUrl.search', QueryUrl.search]);
    // }

    const fetchData = useApi('/list/organisation', queryParameter, requestOptions);

    const mountedRef = useRef(true);

    const [hookState, setHookState] = React.useState<State>({
        state: apiStates.LOADING,
        error: undefined,
        organisations: undefined
    });

    // const load = (properties: Props) => {
    //     const setPartData = (partialData: {
    //         state: string,
    //         organisations?: Array<Organisation>,
    //         error?: string,
    //         pageCount?: number,
    //         pageSize?: number,
    //         totalItems?: number,
    //         page?: number
    //     }) => {
    //         if (!mountedRef.current) return null;
    //         setHookState(hookState => ({ ...hookState, ...partialData }))
    //     }

    //     const fetchAsync = async () => {

    //         // has to be removed otherwise it will re-render the complete page maybe add a reloading state?
    //         // setPartData({
    //         //     state: apiStates.LOADING,
    //         // })

    //         try {
    //             const data = await fetchData(properties)
    //             // console.log(['data', data]);
    //             setPartData({
    //                 state: apiStates.SUCCESS,
    //                 organisations: data._embedded.organisations,
    //                 pageCount: data.page_count,
    //                 pageSize: data.page_size,
    //                 totalItems: data.total_items,
    //                 page: data.page
    //             })
    //         } catch (error: any) {
                
    //             console.log('error catched', error);
    //             setPartData({
    //                 state: apiStates.ERROR,
    //                 error: error.message
    //             });
    //         }
    //     }
    //     fetchAsync();
    // }

    // same but with using useCallback
    const load = useCallback(async (queryParameter: Props, requestOptions = {}) => {
        const setPartData = (partialData: {
            state: string,
            organisations?: Array<Organisation>,
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
        // setPartData({
        //     state: apiStates.LOADING,
        // })

        try {
            // const data = await <Response>fetchData(queryParameter, requestOptions)  // doesn't work don't know how the interface could be used.
            const data = await fetchData(queryParameter, requestOptions)
            setPartData({
                state: apiStates.SUCCESS,
                organisations: data._embedded.organisations,
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
        load(queryParameter, requestOptions);

        // important unload of unmounted component
        return () => {
            console.log('unload in useOrganisations');
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
