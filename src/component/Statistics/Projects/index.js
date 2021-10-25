// import React, { useState, useEffect } from 'react';
import React, { useEffect } from 'react';
import useState from 'react-usestateref';

import { Form, Button } from "react-bootstrap";
import ProjectTable from "./project-table";
import ProjectFacets from './project-facets';
import { getFilter } from '../../../function/Api';


export default function ProjectStatistics(props) {

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
    }, [props.location.hash]);


    const updateFilter = (event) => {
        const target = event.target;
        var name = target.name;
        var value = target.value;
        var updatedValues = {};
      
        if (target.type === 'checkbox') { 
            // slice is required otherwise currentValue would be reference to filter[name] and any modification will change filter directly
            var currentValue = filter[name].slice(); 
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
                        <h1>Project statistics</h1>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-4'}>   
                        <ProjectFacets filter={filter} setFilter={setFilter} updateFilter={updateFilter} updateHash={updateHash} updateResults={updateResults} />
                    </div>
                    <div className={'col-8'}>

                        <ProjectTable filter={filter} />

                        <Button onClick={downloadExcel}>Download</Button>
                    </div>
                </div>
            </Form>
        </React.Fragment>);
}