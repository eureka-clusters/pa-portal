import React from 'react';
import { Form } from "react-bootstrap";
import { apiStates, Api, getFilter, ApiError } from 'function/Api';

const PartnerFacets = ({ filter, setFilter, updateFilter, updateResults, updateHash }) => {

    const { state, error, data } = Api('/statistics/facets/partner?filter=' + getFilter(filter));

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />;
        case apiStates.SUCCESS:
            
            let facetData = data._embedded.facets;

            return (
                <>
                    {/* <pre className='debug'>{JSON.stringify(filter, undefined, 2)}</pre> */}
                    <fieldset>
                        <legend><small>Countries</small></legend>
                       
                        {facetData[0] && facetData[0].map((country, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-country-${i}`}>
                                    <Form.Check.Input
                                        name="country"
                                        value={country['country']}
                                        onChange={updateFilter}
                                        checked={
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
        
                    <fieldset>
                        <legend><small>Years</small></legend>
                        
                        {facetData[4] && facetData[4].map((year, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-year-${i}`}>
                                    <Form.Check.Input
                                        name="year"
                                        value={year['year']}
                                        onChange={updateFilter}
                                        checked={
                                            filter['year'].indexOf(year['year'].toString()) > -1
                                        }
                                    />
                                    <Form.Check.Label>{year['year']}</Form.Check.Label>
                                    {/* @johan do we add an amount for year?
                                     <Form.Check.Label>{year['year']} ({year['amount']})</Form.Check.Label> */}
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