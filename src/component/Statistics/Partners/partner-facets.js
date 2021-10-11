import React from 'react';

import { Form, Button } from "react-bootstrap";
import NumberFormat from "react-number-format";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { apiStates, Api } from '../../../function/Api';
import { Link } from "react-router-dom";

const PartnerFacets = ({ filter, updateFilter, updateHash }) => {

    const [facetUrl, setFacetUrl] = React.useState('/statistics/facets/partner?filter=' + btoa(JSON.stringify(filter)));
    const { state, error, data, load } = Api(facetUrl);

    const updateCountryMethod = (event) => {
        filter['country_method'] = event ? 'and' : 'or';
        updateHash();
    }

    const updateOrganisationTypeMethod = (event) => {
        filter['organisation_type_method'] = event ? 'and' : 'or';
        updateHash();
    }

    const updateProjectStatusMethod = (event) => {
        filter['project_status_method'] = event ? 'and' : 'or';
        updateHash();
    }

    const updatePrimaryClusterMethod = (event) => {
        filter['primary_cluster_method'] = event ? 'and' : 'or';
        updateHash();
    }

    switch (state) {
        case apiStates.ERROR:
            return <p>ERROR: {error || 'General error'}</p>;
        case apiStates.SUCCESS:
            
            let facetData = data._embedded.facets;

            return (
                <>
                    <fieldset>
                        <legend><small>Countries</small></legend>
        
                        <BootstrapSwitchButton checked={filter['country_method'] === 'and'}
                            size="sm"
                            onlabel={"and"}
                            offlabel={"or"}
                            onstyle={'primary'}
                            offstyle={'secondary'} onChange={updateCountryMethod} />
        
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
        
                        <BootstrapSwitchButton checked={filter['partner_type_method'] === 'and'}
                            size="sm"
                            onlabel={"and"}
                            offlabel={"or"}
                            onstyle={'primary'}
                            offstyle={'secondary'} onChange={updateOrganisationTypeMethod} />
        
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
        
                        <BootstrapSwitchButton checked={filter['project_status_method'] === 'and'}
                            size="sm"
                            onlabel={"and"}
                            offlabel={"or"}
                            onstyle={'primary'}
                            offstyle={'secondary'} onChange={updateProjectStatusMethod} />
        
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
                        <BootstrapSwitchButton checked={filter['primary_cluster_method'] === 'and'}
                            size="sm"
                            onlabel={"and"}
                            offlabel={"or"}
                            onstyle={'primary'}
                            offstyle={'secondary'} onChange={updatePrimaryClusterMethod} />
        
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