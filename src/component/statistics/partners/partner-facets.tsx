import React, {FC} from 'react';
import {Form} from "react-bootstrap";

// import {ApiError, apiStates, getFilter} from "function/api";
// import { GetFacets } from "function/api/statistics/partner/get-facets"; // old api
import {getFilter} from 'function/api';
import {ApiError, apiStates, useFacets} from 'hooks/api/statistics/partners/useFacets'; // new api

interface Props {
    filter: any,
    setFilter: any,
    updateFilter: any,
    updateResults: any,
    updateHash: any
}

// const PartnerFacets = (filter: any, setFilter: any, updateFilter: any, updateResults: any, updateHash: any) => {
const PartnerFacets: FC<Props> = ({filter, setFilter, updateFilter, updateResults, updateHash}) => {

    // const {state, error, facets} = GetFacets(getFilter(filter)); // old api
    const {state, error, facets} = useFacets({filter: getFilter(filter)}); // new api

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error}/>;
        case apiStates.SUCCESS:

            return (
                <>
                    <fieldset>
                        <legend><small>Countries</small></legend>
                        {facets.countries && facets.countries.map((country, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-country-${i}`}>
                                    <Form.Check.Input
                                        name="country"
                                        value={country['name']}
                                        className={'me-2'}
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

                        {facets.organisationTypes && facets.organisationTypes.map((organisationType, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-type-${i}`}>
                                    <Form.Check.Input
                                        name="organisation_type"
                                        value={organisationType['name']}
                                        className={'me-2'}
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

                        {facets.projectStatus && facets.projectStatus.map((projectStatus, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-project-status-${i}`}>
                                    <Form.Check.Input
                                        name="project_status"
                                        value={projectStatus['name']}
                                        onChange={updateFilter}
                                        className={'me-2'}
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
                        <legend><small>Programme Call</small></legend>

                        {facets.programmeCalls && facets.programmeCalls.map((programmeCall, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-project-programmecall-${i}`}>
                                    <Form.Check.Input
                                        name="programme_call"
                                        value={programmeCall['name']}
                                        onChange={updateFilter}
                                        className={'me-2'}
                                        checked={
                                            filter['programme_call'].indexOf(programmeCall['name']) > -1
                                        }
                                    />
                                    <Form.Check.Label>{programmeCall['name']} ({programmeCall['amount']})</Form.Check.Label>
                                </Form.Check>
                            </div>
                        ))}
                    </fieldset>

                    <fieldset>
                        <legend><small>Clusters</small></legend>

                        {facets.clusters && facets.clusters.map((cluster, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-cluster-${i}`}>
                                    <Form.Check.Input
                                        name="clusters"
                                        value={cluster['name']}
                                        onChange={updateFilter}
                                        className={'me-2'}
                                        checked={
                                            filter['clusters'].indexOf(cluster['name']) > -1
                                        }
                                    />
                                    <Form.Check.Label>{cluster['name']} ({cluster['amount']})</Form.Check.Label>
                                </Form.Check>
                            </div>
                        ))}
                    </fieldset>

                    <fieldset>
                        <legend><small>Years</small></legend>

                        {facets.years && facets.years.map((year, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-year-${i}`}>
                                    <Form.Check.Input
                                        name="year"
                                        value={year}
                                        onChange={updateFilter}
                                        className={'me-2'}
                                        checked={
                                            filter['year'].indexOf(year.toString()) > -1
                                        }
                                    />
                                    <Form.Check.Label>{year}</Form.Check.Label>
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