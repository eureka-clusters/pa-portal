import React from 'react';
import { Form, Button } from "react-bootstrap";
import PartnerTable from "./partner-table";
import PartnerFacets from './partner-facets';
import TableFilter from '../../../function/Api/TableFilter';
import { useAuth } from "../../../context/UserContext";
import { getFilter, getServerUri } from '../../../function/Api';
import downloadBase64File from "../../../function/DownloadBase64";
// import ResultChart from "./ResultChart";

export default function PartnerStatistics(props) {
    
    let auth = useAuth();

    const defaultFilter = {
        country: [],
        country_method: 'or',            // @johan are these required on the backend? as "and" makes no sence here
        organisation_type: [],
        organisation_type_method: 'or',  // @johan are these required on the backend? as "and" makes no sence here
        project_status: [],
        project_status_method: 'or',     // @johan are these required on the backend? as "and" makes no sence here
        primary_cluster: [],
        primary_cluster_method: 'or',    // @johan are these required on the backend? as "and" makes no sence here
        year: [],
    };

    const { filtertest, updateHash, updateFilter, filter, setFilter } = TableFilter({ props, defaultFilter });

    const downloadExcel = async () => {
        var serverUri = getServerUri();
        var hash = getFilter(filter);
        let accessToken = await auth.getToken();
        fetch(serverUri + '/api/statistics/download/partner/' + hash,
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


    const updateResults = () => { }

    return (
        <React.Fragment>
            {/* {filtertest} */}
            <Form>
                <div className={'row'}>
                    <div className={'col-12'}>
                        <h1>Partner statistics</h1>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-2'}>
                        <PartnerFacets filter={filter} setFilter={setFilter} updateFilter={updateFilter} updateHash={updateHash} updateResults={updateResults} />
                    </div>
                    <div className={'col-10'}>

                        <PartnerTable filter={filter} />

                        <Button onClick={downloadExcel}>Download</Button>
                    </div>
                </div>
            </Form>
        </React.Fragment>);
}