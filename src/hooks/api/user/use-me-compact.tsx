import React, {useRef} from 'react'
import {useApi} from 'hooks/api/useApi';

interface Props {
}

export function useMeCompact(queryParameter: Props, requestOptions = {}) {

    // fetchData is a callback function
    // const fetchData = useApi('/me', { method: 'Post', body: JSON.stringify({ title: 'React POST Request Example' })}); // post + overwrite headers example
    const fetchData = useApi('/me', {});

    const mountedRef = useRef(true);


    const [state, setState] = React.useReducer((_: any, action: any) => action, {
        isLoading: true,
    })

    const load = async () => {
        if (!mountedRef.current) return null
        setState({isLoading: true})
        try {
            // await __delay__(3000);
            const data = await fetchData(queryParameter, requestOptions)

            if (!mountedRef.current) return null
            setState({isSuccess: true, data})
        } catch (error) {
            // console.log('error catched');
            if (!mountedRef.current) return null
            setState({isError: true, error})
        }
    }

    React.useEffect(() => {
        // function must be outside otherwise i couldn't return it e.g. for a reload button
        mountedRef.current = true;
        load();
        return () => {
            mountedRef.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mountedRef]);

    // console.log(['fetch', fetch]);
    return {
        ...state,
        load,
    }
}