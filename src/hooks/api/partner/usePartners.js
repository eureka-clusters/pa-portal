import React from 'react'
import { useApi } from 'hooks/api/useApi';
import { Partner } from "interface/project/partner";


export default function usePartners() {

    const fetchData = useApi('/list/partner');

    const [state, setState] = React.useReducer((_, action) => action, {
        isLoading: true,
    })

    const fetch = async () => {
        setState({ isLoading: true })
        try {
            // await __delay__(3000);
            // const response = await fetchData()
            // const { data } = response;

            // const response = await fetchData()
            const data = await fetchData()
            // console.log(['data', data]);
            console.log(['data', data._embedded.partners]);
            // setState({ isSuccess: true, data })
            setState({ isSuccess: true, data: data._embedded.partners })

            // setState({ isSuccess: true, data._embedded.partners })
            

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
