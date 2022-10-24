import React, {useCallback} from 'react'
import {ApiError} from "interface/api/api-error";
import {ApiStates} from 'hooks/api/api-error';
import {UserInfo} from "interface/auth/user-info";
import axios from "axios";


interface State {
    state: string,
    error?: ApiError,
    user: UserInfo,
}


export function useMe() {

    const [hookState, setHookState] = React.useState <State>({
        state: ApiStates.LOADING,
        user: {} as UserInfo
    });

    const load = useCallback(async () => {

        const setPartData = (partialData: {
            state: string;
            user?: UserInfo;
            error?: ApiError;
        }) => {
            // Before setState ensure that the component is mounted, otherwise return null and don't allow to unmounted component.
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        setPartData({
            state: ApiStates.LOADING,
        })

        try {
            let url = '/me';
            axios.create().get<UserInfo>(url)
                .then(response => {
                    const {data} = response;

                    setPartData({
                        state: ApiStates.SUCCESS,
                        user: data
                    })
                });


        } catch (error: any) {
            setPartData({
                state: ApiStates.ERROR,
                error: error
            });
        }
    }, []);


    React.useEffect(() => {
        load().then(() => {
            return;
        });

    }, [load]);

    return {...hookState, load: load};
}
