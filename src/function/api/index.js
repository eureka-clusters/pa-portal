import React from 'react';
import { useAuth } from "context/UserContext";
import Config from "constants/Config";
import axios from 'axios';

export { getFilter } from './FilterFunctions';
export { ApiError } from './ApiError.js';



export const apiStates = {
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
}

export const getServerUri = () => {
    const serverUri = Config.SERVER_URI;
    return serverUri;
};

export const Api = url => {

    let auth = useAuth();

    const [hookState, setHookState] = React.useState({
        state: apiStates.LOADING,
        error: '',
        data: []
    });
    
    const createInstance = async () => {
        const serverUri = getServerUri();
        let accessToken = await auth.getToken();
        
        const instance = axios.create({
            baseURL: serverUri + '/api',
            timeout: 5000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return instance;
    };

    const load = (directurl) => {

        const setPartData = partialData => {
            setHookState(hookState => (hookState = { ...hookState, ...partialData }))
        }

        if (directurl !== undefined) {
            url = directurl; 
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
                        error: error.response.data.title + ' ' + error.response.data.status +'\n'+ error.response.data.detail
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
    
    return { ...hookState, load: load};
}
