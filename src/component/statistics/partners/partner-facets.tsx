import {FC} from 'react';
import {Form} from "react-bootstrap";
import {getFilter} from 'function/api';
import {ApiError, apiStates, useFacets} from 'hooks/api/statistics/partners/useFacets';
import { default as ReactSelect, OptionsOrGroups } from "react-select";

interface Props {
    filter: any,
    setFilter: any,
    updateFilter: any,
    updateResults: any,
    updateHash: any
}


const PartnerFacets: FC<Props> = ({filter, setFilter, updateFilter, updateResults, updateHash}) => {

    const {state, error, facets} = useFacets({filter: getFilter(filter)});

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error}/>;
        case apiStates.SUCCESS:


            // don't know how to fix typescipt issue...
            // var yearsFilterOptions = [];
            // facets.years.forEach(function (element: any) {
            //     yearsFilterOptions.push({ label: element, value: element })
            // });

            // this works
            const yearsFilterOptions = facets.years.map((year, index) => {
                return {
                    label: year,
                    value: year,
                    key: index
                }
            });

            return (
                <>
                    <fieldset>
                        <legend><small>Countries</small></legend>

                        <div style={{ margin: '5px 0px' }}>
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
                                // getOptionLabel={(option) => `${option.name} (${option.amount})`}
                                getOptionLabel={(option) => `${option.name}`}
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
                                    {/* <Form.Check.Label>{organisationType['name']} ({organisationType['amount']})</Form.Check.Label> */}
                                    <Form.Check.Label>{organisationType['name']}</Form.Check.Label>
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
                                    {/* <Form.Check.Label>{projectStatus['name']} ({projectStatus['amount']})</Form.Check.Label> */}
                                    <Form.Check.Label>{projectStatus['name']}</Form.Check.Label>
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
                                // getOptionLabel={(option) => `${option.name} (${option.amount})`}
                                getOptionLabel={(option) => `${option.name}`}
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
                                        className={'me-2'}
                                        checked={
                                            filter['clusters'].indexOf(cluster['name']) > -1
                                        }
                                    />
                                    {/* <Form.Check.Label>{cluster['name']} ({cluster['amount']})</Form.Check.Label> */}
                                    <Form.Check.Label>{cluster['name']}</Form.Check.Label>
                                </Form.Check>
                            </div>
                        ))}
                    </fieldset>

                    <fieldset>
                        <legend><small>Years</small></legend>

                        <div style={{ margin: '5px 0px' }}>
                            <ReactSelect
                                isClearable={false}
                                isMulti
                                className="react-select"
                                classNamePrefix="select"
                                options={yearsFilterOptions}
                                value={yearsFilterOptions.filter(function (option) {
                                    return filter['year'].indexOf(option.value) > -1;
                                })}
                                // add the checkboxes 
                                // components={{
                                //     Option
                                // }}
                                // hideSelectedOptions={false}
                                closeMenuOnSelect={false}
                                onChange={(choices: any) => {
                                    let updatedValues: { [key: string]: Array<string> } = {};
                                    // get the names of the selected choices
                                    updatedValues['year'] = choices.map((choice: { label: string; value: string; key: number }) => choice.value);
                                    setFilter((prevState: any) => ({
                                        ...prevState, ...updatedValues
                                    }))
                                    updateHash();
                                }}
                            />
                        </div>

                        {/* {facets.years && facets.years.map((year, i) => (
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
                        ))} */}
                    </fieldset>


                </>
            );

        default:
            return <p>Loading data...</p>;
    }


}

export default PartnerFacets;