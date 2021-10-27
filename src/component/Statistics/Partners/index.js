import React, { useEffect } from 'react';
import useState from 'react-usestateref';
import { Form, Button } from "react-bootstrap";

import PartnerTable from "./partner-table";
import PartnerFacets from './partner-facets';
import { getFilter } from '../../../function/Api';

// import ResultChart from "./ResultChart";
// import downloadBase64File from "../../function/DownloadBase64";

export default function PartnerStatistics(props) {

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

    const getFilterFromHash = (setFilterMethod, useAsFilter = false) => {
        if (props.location.hash) {
            var hash = atob(props.location.hash.substring(1));
            var newFilter = JSON.parse(hash);
            console.log(['filter from hash', newFilter]);
            if (useAsFilter && typeof setFilterMethod == "function") {
                // console.log('filter set');
                setFilterMethod(prevState => ({
                    ...prevState, ...newFilter
                }))
            }
            return newFilter;
        } else {
            // required to set the filter if browser back button changes url to /projects without any hash
            if (useAsFilter && typeof setFilterMethod == "function") {
                // set default filter when no hash is given
                setFilterMethod(prevState => ({
                    ...prevState, ...defaultFilter
                }))
            }
        }
    }

    // returns the default filter merged with the filters set via the hash filter values
    const getDefaultFilter = () => {
        let merged = { ...defaultFilter, ...getFilterFromHash() };
        return merged;
    }

    const [filter, setFilter, filter_ref] = useState(() => getDefaultFilter());

    const downloadExcel = () => {
        // fetch(serverUri + '/api/statistics/download/' + output + '/' + btoa(JSON.stringify(filter)),
        //     {
        //         method: 'GET',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json',
        //             'Authorization': 'Bearer ' + accessToken
        //         }
        //     }
        // ).then((res) => res.json()).then((res) => {
        //     let extension = res.extension;
        //     let mimetype = res.mimetype;
        //     downloadBase64File(mimetype, res.download, 'Download' + extension);
        // });
    }

    // update the filter depending on the hash in the url
    useEffect(() => {
        getFilterFromHash(setFilter, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.location.hash]);


    const updateFilter = (event) => {
        const target = event.target;
        var name = target.name;
        var value = target.value;
        var updatedValues = {};

        if (target.type === 'checkbox') {
            var currentValue = filter[name].slice(); // slice is required otherwise currentValue would be reference to filter[name] and any modifitcation will change filter directly
            if (target.checked) {
                currentValue.push(value);
            } else {
                const index = currentValue.indexOf(value);
                currentValue.splice(index, 1);
            }
            updatedValues[name] = currentValue;
        } else {
            updatedValues[name] = value;
        }

        // console.log(['updatedValues', updatedValues]);
        // updatedValues = {};
        // updatedValues = { country:['Austria', 'Germany'], country_method: 'and', organisation_type_method: 'and' };
        setFilter(prevState => ({
            ...prevState, ...updatedValues
        }))
        updateHash();
    }

    const updateResults = () => { }

    const updateHash = () => {
        var hash = getFilter(filter_ref.current);
        props.history.push({
            'hash': hash
        });
    }
    

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