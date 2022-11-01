import React, {useCallback} from 'react'
import {ApiError} from "interface/api/api-error";
import {ApiStates} from 'hooks/api/api-error';
import {Facets} from "interface/statistics/project/facets";
import {FilterValues} from "interface/statistics/filter-values";
import axios from "axios";

interface State {
    state: string,
    error?: ApiError,
    facets: Facets,
}


export function useFacets(filter: FilterValues) {

    const [hookState, setHookState] = React.useState<State>({
        state: ApiStates.LOADING,
        // facets: undefined
        facets: {} as Facets
    });


    const load = useCallback(async (filter: FilterValues) => {
        const setPartData = (partialData: {
            state: string,
            facets?: Facets,
            error?: ApiError
        }) => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        try {

            const abortController = new AbortController();
            const url = "/statistics/facets/project/" + btoa(JSON.stringify(filter));

            axios.create().get<Facets>(url, {
                signal: abortController.signal
            }).then(response => {
                const {data} = response;

                setPartData({
                    state: ApiStates.SUCCESS,
                    facets: data
                })
            });

            return () => {
                abortController.abort();
            }
        } catch (error: any) {
            setPartData({
                state: ApiStates.ERROR,
                error: error
            });
        }
    }, [filter]);

    // useEffect(() => {
    //
    //     load(filter).then(() => {
    //         return;
    //     });
    //
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [filter]);

    return {...hookState, load: load};
}
