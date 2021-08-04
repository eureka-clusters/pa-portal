import { useState, useEffect } from 'react'
import { useAuth } from "../context/UserContext";

export const apiStates = {
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
}

export const useApi = url => {

    let auth = useAuth();

    const [hookState, setHookState] = useState({
        state: apiStates.LOADING,
        error: '',
        data: []
    })
    
    const getHeader = async () => {
        let accessToken = await auth.getToken();

        const headers = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }
        return headers; 
    }

    useEffect(() => {

        const setPartData = partialData => {
            setHookState(hookState => (hookState = { ...hookState, ...partialData }))
        }
        setPartData({
            state: apiStates.LOADING
        })
        getHeader().then(headers => {
            fetch(url, headers)
                .then((response) => {
                    //Fetch detects only network errors. Other errors (401, 400, 500) should be manually caught and rejected
                    if (response.status >= 400 && response.status < 600) {
                        throw new Error("Bad response from server");
                    }
                    return response.json();
                })
                .then(data => {
                    setPartData({
                        state: apiStates.SUCCESS,
                        data: data
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
    }, [url])

    return hookState
}
