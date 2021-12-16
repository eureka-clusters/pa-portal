import React from 'react'
import { useApi, apiStates} from 'hooks/api/useApi';
export { apiStates } from 'hooks/api/useApi';

// test with inline states
export function useMe2() {
    
    // fetchData is a callback function
    // const fetchData = useApi('/me', { method: 'Post', body: JSON.stringify({ title: 'React POST Request Example' })}); // post + overwrite headers example
    const fetchData = useApi('/me', {});

    const [state, setState] = React.useReducer((_: any, action: any) => action, {
        isLoading: true,
    })
    
    const load = async () => {
        setState({ isLoading: true })
        try {
            // await __delay__(3000);
            const data = await fetchData()
            console.log(['data', data]);
            setState({ isSuccess: true, data })
        } catch (error) {
            console.log('error catched');
            setState({ isError: true, error })
        }
    }   
    
    React.useEffect(() => {
        // function must be outside otherwise i couldn't return it e.g. for a reload button
        // const fetchAsync = async () => {
        //     setState({ isLoading: true })
        //     try {
        //         // await __delay__(3000);
        //         const data = await fetchData()
        //         console.log(['data', data]);
        //         setState({ isSuccess: true, data })
        //     } catch (error) {
        //         console.log('error catched');
        //         setState({ isError: true, error })
        //     }
        // }   
        load();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    // console.log(['fetch', fetch]);
    return {
        ...state,
        load,
    }
}

// test with our current states
interface Me {
    email: string,
    first_name: string,
    last_name: string, 
    funder_clusters: Array<string>
    funder_country: string,
    id: number,
    is_funder: boolean,
    _links: any,
}


interface State {
    state: string,
    error?: string,
    // data: <Me>  // couldn't get the typescript typing to work work?
    data: any
}

export function useMe() {

    const fetchData = useApi('/me', {});

    const [hookState, setHookState] = React.useState <State> ({
        state: apiStates.LOADING,
        error: '',
        data: []
    });

    const load = () => {

        const setPartData = (partialData: { state: string; data?: Array<Me>; error?: string; }) => {
            setHookState(hookState => ({ ...hookState, ...partialData }))
        }

        // const setPartData = (partialData: { state: string; data?: Array<any>; error?: string; }) => {
        //     setHookState(hookState => ({ ...hookState, ...partialData }))
        // }

        const fetchAsync = async () => {
            setPartData({
                state: apiStates.LOADING,
            })
            try {
                const data = await fetchData()
                // console.log(['data', data]);
                setPartData({
                    state: apiStates.SUCCESS,
                    data: data
                })
            } catch (error: any) {
                // console.log('error catched', error);
                setPartData({
                    state: apiStates.ERROR,
                    error: error
                });
            }
        }
        fetchAsync();
    }

    React.useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { ...hookState, load: load };
}
