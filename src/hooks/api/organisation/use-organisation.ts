import React, {useCallback, useEffect} from 'react'
import axios from 'axios';
import {Organisation} from 'interface/organisation';
import {ApiError} from "interface/api/api-error";
import {ApiStates} from 'hooks/api/api-error';

interface State {
    state: string,
    error?: ApiError,
    organisation: Organisation,
}

export function useOrganisation(slug: string) {

    const [hookState, setHookState] = React.useState<State>({
        state: ApiStates.LOADING,
        organisation: {} as Organisation
    });

    const load = useCallback(async (slug: string) => {
        let url = '/view/organisation/' + slug;

        const setPartData = (partialData: {
            state: string,
            organisation?: Organisation,
            error?: ApiError,
        }) => {

            setHookState(hookState => ({...hookState, ...partialData}))
        }

        setPartData({
            state: ApiStates.LOADING,
            organisation: {} as Organisation
        })

        const abortController = new AbortController();

        axios.create().get<Organisation>(url, {signal: abortController.signal})
            .then(response => {

                const {data} = response;

                setPartData({
                    state: ApiStates.SUCCESS,
                    organisation: data
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);


    return {...hookState, load: load};
}

