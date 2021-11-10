import React from 'react';
import { Form, Button } from "react-bootstrap";
import ProjectTable from "./project-table";
import ProjectFacets from './project-facets';
import TableFilter from '../../../function/Api/TableFilter';
import { useAuth } from "../../../context/UserContext";
import { getFilter, getServerUri } from '../../../function/Api';
import downloadBase64File from "../../../function/DownloadBase64";
import BreadcrumbTree from '../../partial/BreadcrumbTree'

// useToggle only for testing a togglebutton
// import { useToggle } from '../../../function/utils';
// import { DownloadButton } from './download-excel';

export default function ProjectStatistics(props) {

    let auth = useAuth();

    // const [isTextChanged, setIsTextChanged] = useToggle();

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

    const { updateHash, updateFilter, filter, setFilter  } = TableFilter({ props, defaultFilter});

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
                        <BreadcrumbTree current="statistics-projects" linkCurrent={true} />
                        <h1>Project statistics</h1>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-2'}>   
                        <ProjectFacets filter={filter} setFilter={setFilter} updateFilter={updateFilter} updateHash={updateHash} updateResults={updateResults} />
                    </div>
                    <div className={'col-10'}>

                        <ProjectTable filter={filter} />
                        
                        <Button onClick={downloadExcel}>Export to Excel</Button>
                        

                        {/* <Button onClick={setIsTextChanged}>{isTextChanged ? 'Toggled' : 'Click to Toggle'}</Button> // simple toggle button
                        <DownloadButton filter={filter} /> (test with the download button with status opens download 2x <br />the download also starts if togglebutton is clicked and download not reseted) */}
                    </div>
                </div>
            </Form>
        </React.Fragment>);
}