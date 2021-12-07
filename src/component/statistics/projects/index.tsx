import React from 'react';
import {Button, Form} from "react-bootstrap";
import ProjectTable from "component/statistics/projects/project-table";
import ProjectFacets from 'component/statistics/projects/project-facets';
import TableFilter from 'function/api/table-filter';
import { useAuth} from "context/user-context";
import {getFilter, GetServerUri} from 'function/api/index';
import downloadBase64File from "function/DownloadBase64";
import {RouteComponentProps} from "react-router-dom";

//Create the interface to identify the slug
interface MatchParams {
    slug: string
}

interface Props extends RouteComponentProps<MatchParams> {
}

export default function ProjectStatistics(props: Props) {

    let auth = useAuth();

    const defaultFilter = {
        country: [],
        country_method: 'or',
        organisation_type: [],
        organisation_type_method: 'or',
        project_status: [],
        project_status_method: 'or',
        primary_cluster: [],
        primary_cluster_method: 'or',
        year: [],
    };

    const {updateHash, updateFilter, filter, setFilter} = TableFilter({props, defaultFilter});

    const downloadExcel = async () => {
        var serverUri = GetServerUri();
        var hash = getFilter(filter);
        let accessToken = auth.getJwtToken();
        fetch(serverUri + '/api/statistics/download/project/' + hash,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            }
        ).then((res) => res.json()).then((res) => {
            let extension = res.extension;
            let mimetype = res.mimetype;
            downloadBase64File(mimetype, res.download, 'Download' + extension);
        });
    }

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

                        <ProjectTable filter={filter}/>

                        <br/><br/>

                        <Button onClick={downloadExcel}>Export to Excel</Button>

                    </div>
                </div>
            </Form>
        </React.Fragment>);
}