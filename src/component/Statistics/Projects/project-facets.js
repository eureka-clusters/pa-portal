import React from 'react';

import { Form } from "react-bootstrap";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { apiStates, Api, getFilter, ApiError } from '../../../function/api';

const ProjectFacets = ({ filter, setFilter, updateFilter, updateResults, updateHash }) => {
  
    const { state, error, data } = Api('/statistics/facets/project?filter=' + getFilter(filter));

    const updateCountryMethod = (event) => {
        // filter['country_method'] = event ? 'and' : 'or';
        var updatedValues = {
            country_method: (event ? 'and' : 'or')
        };
        setFilter(prevState => ({
            ...prevState, ...updatedValues
        }))

        updateResults();
        updateHash();
    }

    const updateOrganisationTypeMethod = (event) => {
        // filter['organisation_type_method'] = event ? 'and' : 'or';
        var updatedValues = {
            organisation_type_method: (event ? 'and' : 'or')
        };
        setFilter(prevState => ({
            ...prevState, ...updatedValues
        }))

        updateResults();
        updateHash();
    }

    switch (state) {
        case apiStates.ERROR:
            return (
                <>
                    <ApiError error={error} />
                    <pre className='debug'>{JSON.stringify(filter, undefined, 2)}</pre>
                </>
            );
        case apiStates.SUCCESS:

            let facetData = data._embedded.facets;

            return (
                <>
                    {/* <pre className='debug'>{JSON.stringify(filter, undefined, 2)}</pre> */}
                    <fieldset>
                        <legend><small>Countries</small></legend>
                        <BootstrapSwitchButton checked={filter['country_method'] === 'and'}
                            name="country_method"
                            size="sm"
                            onlabel={"and"}
                            offlabel={"or"}
                            onstyle={'primary'}
                            offstyle={'secondary'} 
                            onChange={updateCountryMethod}
                        />

                        {facetData[0] && facetData[0].map((country, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-country-${i}`}>
                                    <Form.Check.Input
                                        name="country"
                                        value={country['country']}
                                        onChange={updateFilter}
                                        checked ={
                                            filter['country'].indexOf(country['country']) > -1
                                        }
                                    />
                                    <Form.Check.Label>{country['country']} ({country['amount']})</Form.Check.Label>
                                </Form.Check>
                            </div>
                        ))}
                    </fieldset>

                    <fieldset>
                        <legend><small>Organisation type</small></legend>

                        <BootstrapSwitchButton checked={filter['organisation_type_method'] === 'and'}
                            size="sm"
                            onlabel={"and"}
                            offlabel={"or"}
                            onstyle={'primary'}
                            offstyle={'secondary'} onChange={updateOrganisationTypeMethod} />

                        {facetData[1] && facetData[1].map((partnerType, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-type-${i}`}>
                                    <Form.Check.Input 
                                        name="organisation_type"
                                        value={partnerType['organisationType']}
                                        onChange={updateFilter}
                                        checked={
                                            filter['organisation_type'].indexOf(partnerType['organisationType']) > -1
                                        }
                                    />
                                    <Form.Check.Label>{partnerType['organisationType']} ({partnerType['amount']})</Form.Check.Label>
                                </Form.Check>
                            </div>
                        ))}
                    </fieldset>

                    <fieldset>
                        <legend><small>Project Status</small></legend>

                        {facetData[2] && facetData[2].map((projectStatus, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-project-status-${i}`}>
                                    <Form.Check.Input 
                                        name="project_status"
                                        value={projectStatus['projectStatus']}
                                        onChange={updateFilter}
                                        checked={
                                            filter['project_status'].indexOf(projectStatus['projectStatus']) > -1
                                        }
                                    />
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
                                    <Form.Check.Input 
                                        name="primary_cluster"
                                        value={primaryCluster['primaryCluster']}
                                        onChange={updateFilter}
                                        checked={
                                            filter['primary_cluster'].indexOf(primaryCluster['primaryCluster']) > -1
                                        }
                                    />
                                    <Form.Check.Label>{primaryCluster['primaryCluster']} ({primaryCluster['amount']})</Form.Check.Label>
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

export default ProjectFacets;