import React from 'react';
import {useGetPartners} from "@/hooks/partner/use-get-partners";
import {useQuery} from '@/functions/filter-functions';

export default function Partners() {

    const filterOptions = useQuery();

    const {state, setLocalFilterOptions} = useGetPartners({filterOptions});


    if (state.isLoading) {
        return <div>Loading...</div>
    }

    return (
        <React.Fragment>
            <h1>Partners</h1>
            <h3>sorting not yet possible</h3>

        </React.Fragment>
    )
}