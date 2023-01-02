import React from 'react';
import {Form} from "react-bootstrap";
import ProjectTable from "@/component/statistics/projects/project-table";
import ProjectFacets from '@/component/statistics/projects/project-facets';
import TableFilter from '@/functions/api/table-filter';


export default function ProjectStatistics() {

    const {updateFilter, filter, setFilter} = TableFilter();

    return (
        <React.Fragment>
            <Form>
                <div className={'row'}>
                    <div className={'col-2'}>
                        <ProjectFacets
                            filter={filter}
                            setFilter={setFilter}
                            updateFilter={updateFilter}
                        />
                    </div>
                    <div className={'col-10'}>
                        <ProjectTable filter={filter}/>
                    </div>
                </div>
            </Form>
        </React.Fragment>);
}