import React, { useState } from 'react';
import { Form, Button } from "react-bootstrap";

import ProjectTable from "./project-table";
import ProjectFacets from './project-facets';

export default function ProjectStatistics(props) {

    const [hash, setHash] = useState(true);

    const [filter, setFilter] = useState({
        country: [],
        country_method: 'or',
        organisation_type: [],
        organisation_type_method: 'or',
        project_status: [],
        project_status_method: 'or',
        primary_cluster: [],
        primary_cluster_method: 'or',
        year: [],
    });

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


    const updateFilterJohan = (event) => {
        const target = event.target;

        var name = target.name;
        var value = target.value;

        if (target.type === 'checkbox') {
            if (target.checked) {
                filter[name].push(value);
            } else {
                const index = filter[name].indexOf(value);
                filter[name].splice(index, 1);
            }
        } else {
            filter[name] = value;
        }

        // or we trigger the filter update afterwards with nothing.
        setFilter(prevState => ({
            ...prevState, ...{}
        }))

        updateResults();
        updateHash();
    }



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
        props.history.push({
            'hash': btoa(JSON.stringify(filter))
        });

        setHash(btoa(JSON.stringify(filter)))
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
                        <ProjectFacets filter={filter} updateFilter={updateFilter} updateHash={updateHash} updateResults={updateResults} />
                    </div>
                    <div className={'col-10'}>

                        <ProjectTable filter={filter} />

                        <Button onClick={downloadExcel}>Download</Button>
                    </div>
                </div>
            </Form>
        </React.Fragment>);
}