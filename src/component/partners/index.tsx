import React from 'react';
import {Form} from "react-bootstrap";
import PartnerTable from "@/component/partners/partner-table";
import PartnerFacets from '@/component/partners/partner-facets';
import TableFilter from '@/functions/api/table-filter';


export default function PartnerList() {

    const {updateFilter, facetValues, setFilter} = TableFilter();

    return (
        <React.Fragment>
            <Form>
                <div className={'row'}>
                    <div className={'col-2'}>
                        <PartnerFacets facetValues={facetValues}
                                       setFilter={setFilter}
                                       updateFilter={updateFilter}
                        />
                    </div>
                    <div className={'col-10'}>
                        <PartnerTable facetValues={facetValues}/>
                    </div>
                </div>
            </Form>
        </React.Fragment>);
}