import React, {useCallback} from 'react'
import {Partner} from "interface/project/partner";
import {ApiError} from "interface/api/api-error";
import {ApiStates} from 'hooks/api/api-error';
import axios from "axios";
import {createSearchParams} from "react-router-dom";
import {Project} from "../../../interface/project";
import {Organisation} from "../../../interface/organisation";

interface State {
    state: string,
    error?: ApiError,
    partners: Array<Partner>,
    pageCount?: number,
    pageSize?: number,
    totalItems?: number,
    page?: number
}

export interface PartnerResponse {
    _embedded: {
        partners: Array<Partner>
    }
    page_count: number,
    page_size: number,
    total_items: number,
    page: number
}


export function usePartners({
                                project,
                                organisation,
                                page,
                                pageSize,
                            }: { project?: Project, organisation?: Organisation, page?: number, pageSize?: number }) {

    const [hookState, setHookState] = React.useState<State>({
        state: ApiStates.LOADING,
        partners: []
    });

    const load = useCallback(async (queryParameter: any) => {


        const setPartData = (partialData: {
            state: string,
            partners?: Array<Partner>,
            error?: ApiError,
            pageCount?: number,
            pageSize?: number,
            totalItems?: number,
            page?: number
        }) => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        try {

            queryParameter = {
                page: page || 1,
                pageSize: pageSize || 1000
            };

            if (project !== undefined) {
                queryParameter.project = project.slug;
            }

            if (organisation !== undefined) {
                queryParameter.organisation = organisation.slug;
            }

            const abortController = new AbortController();

            let url = '/list/partner?' + createSearchParams(queryParameter).toString();
            axios.create().get<PartnerResponse>(url, {signal: abortController.signal})
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
                });

            return () => {
                abortController.abort()
            };

        } catch (error: any) {
            setPartData({
                state: ApiStates.ERROR,
                error: error
            });
        }
    }, []);

    React.useEffect(() => {
        load({project, organisation, page, pageSize}).then(() => {
            return
        });
    }, [project, organisation, page, pageSize]);


    return {...hookState, load: load};
}
