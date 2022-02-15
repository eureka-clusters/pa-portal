import React from 'react';
import {Form} from "react-bootstrap";
import ProjectTable from "component/statistics/projects/project-table";
import ProjectFacets from 'component/statistics/projects/project-facets';
import TableFilter from 'function/api/table-filter';
import {RouteComponentProps} from "react-router-dom";

//Create the interface to identify the slug
interface MatchParams {
    slug: string
}

interface Props extends RouteComponentProps<MatchParams> {
}

export default function ProjectStatistics(props: Props) {

    const defaultFilter = {
        country: [],
        country_method: 'or',
        organisation_type: [],
        organisation_type_method: 'or',
        project_status: [],
        project_status_method: 'or',
        clusters: [],
        clusters_method: 'or',
        year: [],
    };

    const {updateHash, updateFilter, filter, setFilter} = TableFilter({props, defaultFilter});

 
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