import React from 'react';
import {Form} from "react-bootstrap";
import ProjectTable from "component/statistics/projects/project-table";
import ProjectFacets from 'component/statistics/projects/project-facets';
import TableFilter from 'function/api/table-filter';
import {useNavigate, useParams} from "react-router-dom";


export default function ProjectStatistics() {

    const {hash} = useParams();

    const defaultFilter = {
        country: [],
        country_method: 'or',
        organisation_type: [],
        organisation_type_method: 'or',
        project_status: [],
        project_status_method: 'or',
        programme_call: [],
        clusters: [],
        clusters_method: 'or',
        year: [],
    };

    const {updateHash, updateFilter, filter, setFilter} = TableFilter({hash, defaultFilter});

     const updateResults = () => {
    }

    return (
        <React.Fragment>
            <Form>
                <div className={'row'}>
                    <div className={'col-12'}>
                        <h1>Project statistics</h1>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-2'}>
                        <ProjectFacets filter={filter} setFilter={setFilter} updateFilter={updateFilter}
                                       updateHash={updateHash} updateResults={updateResults}/>
                    </div>
                    <div className={'col-10'}>
                        <ProjectTable filter={filter} />
                    </div>
                </div>
            </Form>
        </React.Fragment>);
}