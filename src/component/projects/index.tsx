import React from 'react';
import {Form} from "react-bootstrap";
import ProjectTable from "@/component/projects/project-table";
import ProjectFacets from '@/component/projects/project-facets';
import TableFilter from '@/functions/api/table-filter';


export default function ProjectList() {

    const {updateFilter, facetValues, setFilter} = TableFilter();

    return (
        <React.Fragment>
            <Form>
                <div className={'row'}>
                    <div className={'col-2'}>
                        <ProjectFacets
                            facetValues={facetValues}
                            setFilter={setFilter}
                            updateFilter={updateFilter}
                        />
                    </div>
                    <div className={'col-10'}>
                        <ProjectTable facetValues={facetValues}/>
                    </div>
                </div>
            </Form>
        </React.Fragment>);
}