import React, { useRef, useCallback } from 'react'
import { useApi, apiStates, iApiError } from 'hooks/api/useApi';
import { Partner } from "interface/project/partner";
// import { Project } from "interface/project";
// import { Organisation } from "interface/organisation";

export { ApiError, apiStates } from 'hooks/api/useApi';


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
    // project?: Project,
    // organisation?: Organisation,
    project?: string,
    organisation?: string,
    filter?: string,
    page?: number,
    pageSize?: number,
    sort?: string,
    order?: string,
}

const defaultProps = {
    page: 1,
    pageSize: -1,
    filter: '',
    project: undefined,
    organisation: undefined,
}


export function usePartners(queryParameter: Props, requestOptions = {}) {   
    queryParameter = { ...defaultProps, ...queryParameter }

    let url = '/list/partner';

    // as we only need the slug of the project for the queryParam.
    // we could also consider to change the project to string and give the hook the project.slug instead of the complete project object.

    // this part could be removed if project + organisation would be of type string and filled with the .slug value.
    // if (typeof queryParameter.project !== 'undefined') {
    //     url = url +'?project=' + queryParameter.project.slug;
    //     delete queryParameter.project;
    // } else if (typeof queryParameter.organisation !== 'undefined') {
    //     url = url + '?organisation=' + queryParameter.organisation.slug;
    //     delete queryParameter.organisation;
    // }


    const fetchData = useApi(url, queryParameter, requestOptions);

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

