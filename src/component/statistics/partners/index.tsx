import React from 'react';
import { Form, Button } from "react-bootstrap";
import PartnerTable from "./partner-table";
import PartnerFacets from './partner-facets';
import TableFilter from '../../../function/api/table-filter';
import { UseAuth } from "../../../context/UserContext";
import { getFilter, getServerUri } from '../../../function/api';
import downloadBase64File from "../../../function/DownloadBase64";
import {RouteComponentProps} from "react-router-dom";
// import ResultChart from "./ResultChart";

//Create the interface to identify the slug
interface MatchParams {
    slug: string
}

interface Props extends RouteComponentProps<MatchParams> {
}

export default function PartnerStatistics(props: Props) {
    
    let auth = UseAuth();

    const defaultFilter = {
        country: [],
        organisation_type: [],
        project_status: [],
        primary_cluster: [],
        year: [],
    };

    const { updateHash, updateFilter, filter, setFilter } = TableFilter({ props, defaultFilter });

    const downloadExcel = async () => {
        const serverUri = getServerUri();
        const hash = getFilter(filter);
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