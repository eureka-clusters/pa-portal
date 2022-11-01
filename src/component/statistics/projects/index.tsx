import React from 'react';
import {Form} from "react-bootstrap";
import ProjectTable from "component/statistics/projects/project-table";
import ProjectFacets from 'component/statistics/projects/project-facets';
import TableFilter from 'function/api/table-filter';


export default function ProjectStatistics() {

    const {updateHash, updateFilter, filter, setFilter} = TableFilter();

    return (
        <React.Fragment>
            <Form>
                <h1>Project statistics</h1>
                <div className={'row'}>
                    <div className={'col-6'}>
                        <ProjectFacets
                            filter={filter}
                            setFilter={setFilter}
                            updateFilter={updateFilter}
                            updateHash={updateHash}
                        />
                    </div>
                    <div className={'col-6'}>
                        <ProjectTable filter={filter}/>
                    </div>
                </div>
            </Form>
        </React.Fragment>);
}