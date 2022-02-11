import React from 'react'
import { useApi } from 'hooks/api/useApi';

export default function useProjectPartners(projectId) {

    const fetchData = useApi(`/list/partner?project=${projectId}`);

    const [state, setState] = React.useReducer((_, action) => action, {
        isLoading: true,
    })

    const fetch = async () => {
        setState({ isLoading: true })
        try {
            // await __delay__(3000);
            const data = await fetchData()
            // console.log(['data', data]);
            setState({ isSuccess: true, data: data._embedded.partners })
        } catch (error) {
            console.log('error catched');
            setState({ isError: true, error })
        }
    }

    React.useEffect(() => {
        fetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        ...state,
        fetch,
    }
}

