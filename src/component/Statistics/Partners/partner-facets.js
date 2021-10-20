import React from 'react';

import { Form, Button } from "react-bootstrap";
import NumberFormat from "react-number-format";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { apiStates, Api, getFilter, ApiError } from '../../../function/Api';
import { Link } from "react-router-dom";

const PartnerFacets = ({ filter, updateFilter, updateHash }) => {

    const [facetUrl, setFacetUrl] = React.useState('/statistics/facets/partner?filter=' + getFilter(filter));
    const { state, error, data, load } = Api(facetUrl);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />;
        case apiStates.SUCCESS:
            
            let facetData = data._embedded.facets;

            return (
                <>
                    <fieldset>
                        <legend><small>Countries</small></legend>
        
                        {facetData[0] && facetData[0].map((country, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-country-${i}`}>
                                    <Form.Check.Input name="country" value={country['country']}
                                        onChange={updateFilter} />
                                    <Form.Check.Label>{country['country']} ({country['amount']})</Form.Check.Label>
                                </Form.Check>
                            </div>
                        ))}
                    </fieldset>
        
                    <fieldset>
                        <legend><small>Organisation type</small></legend>
               
                        {facetData[1] && facetData[1].map((organisationType, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-type-${i}`}>
                                    <Form.Check.Input name="organisation_type" value={organisationType['organisationType']}
                                        onChange={updateFilter} />
                                    <Form.Check.Label>{organisationType['organisationType']} ({organisationType['amount']})</Form.Check.Label>
                                </Form.Check>
                            </div>
                        ))}
                    </fieldset>
        
                    <fieldset>
                        <legend><small>Project Status</small></legend>
        
                        {facetData[2] && facetData[2].map((projectStatus, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-project-status-${i}`}>
                                    <Form.Check.Input name="project_status" value={projectStatus['projectStatus']}
                                        onChange={updateFilter} />
                                    <Form.Check.Label>{projectStatus['projectStatus']} ({projectStatus['amount']})</Form.Check.Label>
                                </Form.Check>
                            </div>
                        ))}
                    </fieldset>
        
                    <fieldset>
                        <legend><small>Primary Cluster</small></legend>
        
                        {facetData[3] && facetData[3].map((primaryCluster, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-primary-cluster-${i}`}>
                                    <Form.Check.Input name="primary_cluster" value={primaryCluster['primaryCluster']}
                                        onChange={updateFilter} />
                                    <Form.Check.Label>{primaryCluster['primaryCluster']} ({primaryCluster['amount']})</Form.Check.Label>
                                </Form.Check>
                            </div>
                        ))}
                    </fieldset>
        
                    <fieldset>
                        <legend><small>Years</small></legend>
        
                        {facetData[4] && facetData[4].map((year, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-year-${i}`}>
                                    <Form.Check.Input name="year" value={year['year']}
                                        onChange={updateFilter} />
                                    <Form.Check.Label>{year['year']}</Form.Check.Label>
                                </Form.Check>
                            </div>
                        ))}
                    </fieldset>
                </>
            );

        default:
            return <p>Loading data...</p>;
    }

    
}

export default PartnerFacets;