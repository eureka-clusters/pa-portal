import React, {useCallback, useEffect} from 'react'
import {ApiError} from "interface/api/api-error";
import {ApiStates} from 'hooks/api/api-error';
import {Facets} from "interface/statistics/project/facets";
import axios from "axios";


interface State {
    state: string,
    error?: ApiError,
    facets: Facets,
}


export function useFacets(filter: string) {

    const [hookState, setHookState] = React.useState<State>({
        state: ApiStates.LOADING,
        // facets: undefined
        facets: {} as Facets
    });


    const load = useCallback(async (filter: string) => {
        const setPartData = (partialData: {
            state: string,
            facets?: Facets,
            error?: ApiError
        }) => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        try {

            const url = "/statistics/facets/project/" + filter;

            axios.create().get<Facets>(url)
                .then(response => {

                    const {data} = response;

                    setPartData({
                        state: ApiStates.SUCCESS,
                        facets: data
                    })
                })
        } catch (error: any) {
            setPartData({
                state: ApiStates.ERROR,
                error: error
            });
        }
    }, [filter]);

    useEffect(() => {

        load(filter).then(() => {
            return;
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    return {...hookState, load: load};
}
