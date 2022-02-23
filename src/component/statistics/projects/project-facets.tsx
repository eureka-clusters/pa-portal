import {FC} from 'react';
import {Form} from "react-bootstrap";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { getFilter } from 'function/api';
import { useFacets, apiStates, ApiError } from 'hooks/api/statistics/projects/useFacets';
import { default as ReactSelect } from "react-select";
// import { components } from "react-select"; // required if checkboxes should be added in react-select


/**
 * @TODO get rid fo the any here
 */

interface Props {
    filter: any,
    setFilter: any,
    updateFilter: any,
    updateResults: any,
    updateHash: any
}


const ProjectFacets: FC<Props> = ({filter, setFilter, updateFilter, updateResults, updateHash}) => {

    const { state, error, facets } = useFacets({ filter: getFilter(filter)});

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
    

    // needed for checkboxes in the react-select component
    // const Option = (props:any) => {
    //     return (
    //         <div>
    //             <components.Option {...props}>
    //                 <input
    //                     type="checkbox"
    //                     checked={props.isSelected}
    //                     onChange={() => null}
    //                 />{" "}
    //                 <label>{props.label}</label>
    //             </components.Option>
    //         </div>
    //     );
    // };

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
                        
                        <div style={{ margin: '5px 0px'}}>
                        <ReactSelect
                            isClearable={false}
                            isMulti
                            className="react-select"
                            classNamePrefix="select"
                            options={facets.countries}
                            // components needs the complete filter objects therefore filter these by the filter country array
                            value={
                                facets.countries.filter(function (itm) {
                                    return filter['country'].indexOf(itm.name) > -1;
                                })
                            }
                            getOptionLabel={(option) => `${option.name} (${option.amount})`}
                            getOptionValue={(option) => `${option['name']}`}
                            // add the checkboxes
                            // components={{
                            //     Option
                            // }}
                            // hideSelectedOptions={false}
                            closeMenuOnSelect={false}
                            onChange={(choices: any) => {
                                let updatedValues: { [key: string]: Array<string> } = {};
                                // get the names of the selected choices
                                updatedValues['country'] = choices.map((choice: { name: string; amount: number }) => choice.name);
                                setFilter((prevState: any) => ({
                                    ...prevState, ...updatedValues
                                }))
                                updateHash();
                            }}
                        />
                        </div>


                        {/* // old checkbox filter */}
                        {/* {facets.countries && facets.countries.map((country, i) => (
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
                        ))} */}
                    </fieldset>

                    <fieldset>
                        <legend><small>Organisation type</small></legend>

                        <BootstrapSwitchButton checked={filter['organisation_type_method'] === 'and'}
                                               size="sm"
                                               onlabel={"and"}
                                               offlabel={"or"}
                                               onstyle={'primary'}
                                               offstyle={'secondary'} onChange={updateOrganisationTypeMethod}/>

                        {facets.organisationTypes && facets.organisationTypes.map((organisationType, i) => (
                            <div key={i}>
                                <Form.Check type={'checkbox'} id={`check-type-${i}`}>
                                    <Form.Check.Input
                                        name="organisation_type"
                                        value={organisationType['name']}
                                        onChange={updateFilter}
                                        className={'me-2'}
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

                        <div style={{ margin: '5px 0px' }}>
                            <ReactSelect
                                isClearable={false}
                                isMulti
                                className="react-select"
                                classNamePrefix="select"
                                options={facets.programmeCalls}
                                // components needs the complete filter objects therefore filter these by the filter country array
                                value={
                                    facets.programmeCalls.filter(function (itm) {
                                        return filter['programme_call'].indexOf(itm.name) > -1;
                                    })
                                }
                                getOptionLabel={(option) => `${option.name} (${option.amount})`}
                                getOptionValue={(option) => `${option['name']}`}
                                // add the checkboxes 
                                // components={{
                                //     Option
                                // }}
                                // hideSelectedOptions={false}
                                closeMenuOnSelect={false}
                                onChange={(choices: any) => {
                                    let updatedValues: { [key: string]: Array<string> } = {};
                                    // get the names of the selected choices
                                    updatedValues['programme_call'] = choices.map((choice: { name: string; amount: number }) => choice.name);
                                    setFilter((prevState: any) => ({
                                        ...prevState, ...updatedValues
                                    }))
                                    updateHash();
                                }}
                            />
                        </div>

                        {/* old checkbox filters */}
                        {/* {facets.programmeCalls && facets.programmeCalls.map((programmeCall, i) => (
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
                        ))} */}
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
                                        className={'filter'}
                                        checked={
                                            filter['clusters'].indexOf(cluster['name']) > -1
                                        }
                                    />
                                    <Form.Check.Label>{cluster['name']} ({cluster['amount']})</Form.Check.Label>
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