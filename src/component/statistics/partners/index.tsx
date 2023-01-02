import React from 'react';
import {Form} from "react-bootstrap";
import PartnerTable from "@/component/statistics/partners/partner-table";
import PartnerFacets from '@/component/statistics/partners/partner-facets';
import TableFilter from '@/functions/api/table-filter';

export default function PartnerStatistics() {

    const {updateFilter, filter, setFilter} = TableFilter();

    return (
        <React.Fragment>
            <Form>
                <div className={'row'}>
                    <div className={'col-12'}>
                        <h1>Partner statistics</h1>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-2'}>
                        <PartnerFacets filter={filter}
                                       setFilter={setFilter}
                                       updateFilter={updateFilter}
                        />
                    </div>
                    <div className={'col-10'}>
                        <PartnerTable filter={filter}/>
                    </div>
                </div>
            </Form>
        </React.Fragment>);
}