import React from 'react';

import {Form} from "react-bootstrap";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import {ApiError, apiStates, GetFacets, getFilter} from "function/api/statistics/project/get-facets";

/**
 * @TODO get rid fo the any here
 */

const ProjectFacets = (filter: any, setFilter: any, updateFilter: any, updateResults: any, updateHash: any) => {

    const {state, error, facets} = GetFacets(getFilter(filter));

    const updateCountryMethod = (event: any) => {
        var updatedValues = {
            country_method: (event ? 'and' : 'or')
        };
        setFilter((prevState: any) => ({
            ...prevState, ...updatedValues
        }))

        updateResults();
        updateHash();
    }

    const updateOrganisationTypeMethod = (event: any) => {
        var updatedValues = {
            organisation_type_method: (event ? 'and' : 'or')
        };
        setFilter((prevState: any) => ({
            ...prevState, ...updatedValues
        }))

        updateResults();
        updateHash();
    }

    switch (state) {
        case apiStates.ERROR:
            return (
                <>
                    <ApiError error={error}/>
                    <pre className='debug'>{JSON.stringify(filter, undefined, 2)}</pre>
                </>
            );
        case apiStates.SUCCESS:

            return (
                <>
                    {/* <pre className='debug'>{JSON.stringify(filter, undefined, 2)}</pre> */}
                    <fieldset>
                        <legend><small>Countries</small></legend>
                        <BootstrapSwitchButton checked={filter['country_method'] === 'and'}
                                               size="sm"
                                               onlabel={"and"}
                                               offlabel={"or"}
                                               onstyle={'primary'}
                                               offstyle={'secondary'}
                                               onChange={updateCountryMethod}
                        />

                        {facets.countries.map((country, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-country-${i}`}>
                                    <Form.Check.Input
                                        name="country"
                                        value={country['name']}
                                        onChange={updateFilter}
                                        checked={
                                            filter['country'].indexOf(country['name']) > -1
                                        }
                                    />
                                    <Form.Check.Label>{country['name']} ({country['amount']})</Form.Check.Label>
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
                                               offstyle={'secondary'} onChange={updateOrganisationTypeMethod}/>

                        {facets.organisationTypes.map((organisationType, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-type-${i}`}>
                                    <Form.Check.Input
                                        name="organisation_type"
                                        value={organisationType['name']}
                                        onChange={updateFilter}
                                        checked={
                                            filter['organisation_type'].indexOf(organisationType['name']) > -1
                                        }
                                    />
                                    <Form.Check.Label>{organisationType['name']} ({organisationType['amount']})</Form.Check.Label>
                                </Form.Check>
                            </div>
                        ))}
                    </fieldset>

                    <fieldset>
                        <legend><small>Project Status</small></legend>

                        {facets.projectStatus.map((projectStatus, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-project-status-${i}`}>
                                    <Form.Check.Input
                                        name="project_status"
                                        value={projectStatus['name']}
                                        onChange={updateFilter}
                                        checked={
                                            filter['project_status'].indexOf(projectStatus['name']) > -1
                                        }
                                    />
                                    <Form.Check.Label>{projectStatus['name']} ({projectStatus['amount']})</Form.Check.Label>
                                </Form.Check>
                            </div>
                        ))}
                    </fieldset>

                    <fieldset>
                        <legend><small>Primary Cluster</small></legend>

                        {facets.primaryClusters.map((primaryCluster, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-primary-cluster-${i}`}>
                                    <Form.Check.Input
                                        name="primary_cluster"
                                        value={primaryCluster['name']}
                                        onChange={updateFilter}
                                        checked={
                                            filter['primary_cluster'].indexOf(primaryCluster['name']) > -1
                                        }
                                    />
                                    <Form.Check.Label>{primaryCluster['name']} ({primaryCluster['amount']})</Form.Check.Label>
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