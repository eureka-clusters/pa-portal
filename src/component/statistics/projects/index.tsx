import React from 'react';
import {Button, Form} from "react-bootstrap";
import ProjectTable from "./project-table";
import ProjectFacets from './project-facets';
import TableFilter from '../../../function/api/table-filter';
import {UseAuth} from "../../../context/UserContext";
import {getFilter, getServerUri} from '../../../function/api';
import downloadBase64File from "../../../function/DownloadBase64";
import {DownloadButton} from './download-excel';
import {RouteComponentProps} from "react-router-dom";

//Create the interface to identify the slug
interface MatchParams {
    slug: string
}

interface Props extends RouteComponentProps<MatchParams> {
}

export default function ProjectStatistics(props: Props) {

    let auth = UseAuth();

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
        var serverUri = getServerUri();
        var hash = getFilter(filter);
        let accessToken = await auth.getToken();
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

                        {/*<Button onClick={setIsTextChanged}>{isTextChanged ? 'Toggled' : 'Click to Toggle'}</Button> // simple toggle button*/}
                        <br/><br/>

                        <DownloadButton filter={filter}/> (test with the download button with status opens download
                        2x <br/>the download also starts if togglebutton is clicked and download not reseted)
                        <br/><br/>

                        <Button onClick={downloadExcel}>Export to Excel</Button> // normal export via using fetch (could
                        this mean no error handling?)

                    </div>
                </div>
            </Form>
        </React.Fragment>);
}