import React from "react";
import {UseAuth} from "context/user-context";
import axios from "axios";
import Config from "constants/config";

export {getFilter} from 'function/api/filter-functions';
export {ApiError} from 'function/api/api-error';

export const apiStates = {
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
}

export const GetServerUri = () => {
    const serverUri = Config.SERVER_URI;
    console.log(['serverUri', serverUri]);
    return serverUri;
};

export const Api = (url: string) => {

    let auth = UseAuth();

    const [hookState, setHookState] = React.useState({
        state: apiStates.LOADING,
        error: '',
        data: []
    });

    const createInstance = async () => {
        const serverUri = GetServerUri();
        let accessToken = await auth.getToken();

        return axios.create({
            baseURL: serverUri + '/api',
            timeout: 5000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
    };

    const load = () => {

        const setPartData = partialData => {
            setHookState(hookState => ({...hookState, ...partialData}))
        }

        setPartData({
            state: apiStates.LOADING
        })
        createInstance().then(axios => {
            // axios automatically returns json in response.data and catches errors
            axios.get(url, {
                // settings could be overwritten
                // timeout: 1000
            })
                .then(response => {
                    setPartData({
                        state: apiStates.SUCCESS,
                        data: response.data
                    })
                })

                .catch(function (error) {
                    // setPartData({
                    //     state: apiStates.ERROR,
                    //     error: (error.response &&
                    //         error.response.data &&
                    //         error.response.data.message) ||
                    //         error.message ||
                    //         error.toString()
                    // });

                    if (error.response) {
                        // Request made and server responded
                        console.log(error.response.data);
                        // console.log(error.response.status);
                        // console.log(error.response.headers);
                        setPartData({
                            state: apiStates.ERROR,
                            error: error.response.data.title + ' ' + error.response.data.status + '\n' + error.response.data.detail
                        });
                    } else if (error.request) {
                        // The request timed out
                        console.log(error.request);
                        setPartData({
                            state: apiStates.ERROR,
                            error: 'The request timed out'
                        });
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                        setPartData({
                            state: apiStates.ERROR,
                            error: 'Something happened in setting up the request that triggered an Error'
                        });
                    }
                })

        })

    };

    React.useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    return {...hookState, load: load};
}
