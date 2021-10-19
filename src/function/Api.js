import React from 'react';
import { useAuth } from "../context/UserContext";
import Config from "../constants/Config";
import axios from 'axios';

export { getFilter } from './FilterFunctions';


export const apiStates = {
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
}

export const Api = url => {

    let auth = useAuth();

    const [hookState, setHookState] = React.useState({
        state: apiStates.LOADING,
        error: '',
        data: []
    });
    
    const createInstance = async () => {
        const serverUri = Config.SERVER_URI;
        let accessToken = await auth.getToken();
        console.log('accessToken used in getApi', accessToken);

        const instance = axios.create({
            baseURL: serverUri + '/api',
            timeout: 1000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return instance;
    };

    const load = (directurl) => {
        if (directurl !== undefined) {
            url = directurl; 
        }
        
        const setPartData = partialData => {
            setHookState(hookState => (hookState = { ...hookState, ...partialData }))
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
            .catch((error) => {
                console.error(error)
                setPartData({
                    state: apiStates.ERROR,
                    error: 'fetch failed'
                })
            })
        })
    };

    React.useEffect(() => {
        load();
    }, [url]);
    
    return { ...hookState, load: load };
}
