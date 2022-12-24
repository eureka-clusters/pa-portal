import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import BreadcrumbTree from 'component/partial/breadcrumb-tree';
import {Partner} from "interface/project/partner";
import {CostsFormat, EffortFormat} from 'functions/utils';
import {useGetPartners} from "hooks/partner/use-get-partners";
import { useQuery } from 'functions/filter-functions';


export default function Partners() {

    const filterOptions = useQuery();

    const { state, setLocalFilterOptions } = useGetPartners({ filterOptions });


    if (state.isLoading) {
        return <div>Loading...</div>
    }

    return (
        <React.Fragment>
            <BreadcrumbTree current="partners" data={state.data} linkCurrent={false}/>
            {/* <pre className='debug'>{JSON.stringify(partners, undefined, 2)}</pre> */}
            <h1>Partners</h1>
            <h3>sorting not yet possible</h3>

        </React.Fragment>
    )
}