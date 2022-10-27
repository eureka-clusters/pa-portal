import React, {useCallback} from 'react'
import {ApiError} from "interface/api/api-error";
import {ApiStates} from 'hooks/api/api-error';
import {Partner} from "interface/project/partner";
import axios from "axios";
import {PartnerResponse} from "hooks/api/partner/use-partners";


interface State {
    state: string,
    error?: ApiError,
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

export function usePartners(queryParameter: Props = {
    filter: '',
    page: defaultProps.page,
    pageSize: defaultProps.pageSize
}) {

    const [hookState, setHookState] = React.useState<State>({
        state: ApiStates.LOADING,
        partners: []
    });

    const load = useCallback(async (queryParameter: Props) => {
        const setPartData = (partialData: {
            state: string,
            partners?: Array<Partner>,
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

            const url = '/statistics/results/project?' + queryParameter

            axios.create().get<PartnerResponse>(url)
                .then(response => {

                    const {data} = response;

                    setPartData({
                        state: ApiStates.SUCCESS,
                        partners: data._embedded.partners,
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

    React.useEffect(() => {

        load(queryParameter).then(() => {
            return;
        });

    }, [load, queryParameter]);

    return {...hookState, load: load};
}
