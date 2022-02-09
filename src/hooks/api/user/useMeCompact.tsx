import React, {useRef} from 'react'

import { useApi} from 'hooks/api/useApi';

export function useMeCompact() {

    // fetchData is a callback function
    // const fetchData = useApi('/me', { method: 'Post', body: JSON.stringify({ title: 'React POST Request Example' })}); // post + overwrite headers example
    const fetchData = useApi('/me', {});

    const mountedRef = useRef(true);


    const [state, setState] = React.useReducer((_: any, action: any) => action, {
        isLoading: true,
    })

    const load = async () => {
        if (!mountedRef.current) return null
        setState({ isLoading: true })
        try {
            if (!mountedRef.current) return null

            // await __delay__(3000);
            const data = await fetchData()
            // console.log(['data', data]);
            setState({ isSuccess: true, data })
        } catch (error) {
            if (!mountedRef.current) return null

            // console.log('error catched');
            setState({ isError: true, error })
        }
    }

    React.useEffect(() => {
        // function must be outside otherwise i couldn't return it e.g. for a reload button
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