import React from 'react';
import {Form} from "react-bootstrap";
import PartnerTable from "@/component/statistics/partners/partner-table";
import PartnerFacets from '@/component/statistics/partners/partner-facets';
import TableFilter from '@/functions/api/table-filter';


export default function PartnerStatistics() {

    const {updateFilter, filterValues, setFilter} = TableFilter();

    return (
        <React.Fragment>
            <Form>
                <div className={'row'}>
                    <div className={'col-2'}>
                        <PartnerFacets filterValues={filterValues}
                                       setFilter={setFilter}
                                       updateFilter={updateFilter}
                        />
                    </div>
                    <div className={'col-10'}>
                        <PartnerTable filterValues={filterValues}/>
                    </div>
                </div>
            </Form>
        </React.Fragment>);
}