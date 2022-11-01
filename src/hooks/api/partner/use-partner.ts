import React, {useCallback, useEffect} from 'react'
import axios from 'axios';
import {Partner} from 'interface/project/partner';
import {ApiError} from "interface/api/api-error";
import {ApiStates} from 'hooks/api/api-error';

interface State {
    state: string,
    error?: ApiError,
    partner: Partner,
}

export function usePartner(slug: string) {

    const [hookState, setHookState] = React.useState<State>({
        state: ApiStates.LOADING,
        partner: {} as Partner
    });

    const load = useCallback(async (slug: string) => {
        let url = '/view/partner/' + slug;

        const setPartData = (partialData: {
            state: string,
            partner?: Partner,
            error?: ApiError,
        }) => {

            setHookState(hookState => ({...hookState, ...partialData}))
        }

        setPartData({
            state: ApiStates.LOADING,
            partner: {} as Partner
        })

        const abortController = new AbortController();

        axios.create().get<Partner>(url, {signal: abortController.signal})
            .then(response => {

                const {data} = response;

                setPartData({
                    state: ApiStates.SUCCESS,
                    partner: data
                })
            });

        return () => {
            abortController.abort();
        }
    }, []);

    useEffect(() => {
        load(slug).then(() => {
            return;
        });
    }, [slug]);


    return {...hookState, load: load};
}
