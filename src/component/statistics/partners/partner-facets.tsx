import {FC} from 'react';
import {Form} from "react-bootstrap";
import {default as ReactSelect} from "react-select";
import {FilterValues} from "interface/statistics/filter-values";
import {useGetPartnerFacets} from "hooks/partner/use-get-facets";
import {Facets} from "interface/statistics/partner/facets";

interface Props {
    filter: FilterValues,
    setFilter: any,
    updateFilter: any,
    updateHash: any
}

const PartnerFacets: FC<Props> = ({filter, setFilter, updateFilter, updateHash}) => {

    const {state} = useGetPartnerFacets(filter);

    const facets: Facets = state.data;

    const yearsFilterOptions = facets.years.map((year: number, index: number) => {
        return {
            label: year,
            value: year,
            key: index
        }
    });

    return (
        <>

            {facets.countries ? (
                <fieldset>
                    <legend><small>Countries</small></legend>

                    <div style={{margin: '5px 0px'}}>
                        <ReactSelect
                            isClearable={false}
                            isMulti
                            className="react-select"
                            classNamePrefix="select"
                            options={facets.countries}
                            // components needs the complete filter objects therefore filter these by the filter country array
                            value={
                                facets.countries.filter(function (item) {
                                    return filter['country'] !== undefined && filter['country'].indexOf(item.name) > -1;
                                })
                            }
                            // getOptionLabel={(option) => `${option.name} (${option.amount})`}
                            getOptionLabel={(option) => `${option.name}`}
                            getOptionValue={(option) => `${option['name']}`}
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
                </fieldset>
            ) : ('')}

            {facets.organisationTypes ? (
                <fieldset>
                    <legend><small>Organisation type</small></legend>

                    {facets.organisationTypes && facets.organisationTypes.map((organisationType, i) => (
                        <div key={i}>
                            <Form.Check type={'checkbox'} id={`check-type-${i}`}>
                                <Form.Check.Input
                                    name="organisationType"
                                    value={organisationType['name']}
                                    className={'me-2'}
                                    onChange={updateFilter}
                                    checked={
                                        filter['organisationType'] !== undefined && filter['organisationType'].indexOf(organisationType['name']) > -1
                                    }
                                />
                                {/* <Form.Check.Label>{organisationType['name']} ({organisationType['amount']})</Form.Check.Label> */}
                                <Form.Check.Label>{organisationType['name']}</Form.Check.Label>
                            </Form.Check>
                        </div>
                    ))}
                </fieldset>
            ) : ('')}


            {facets.projectStatus ? (
                <fieldset>
                    <legend><small>Project Status</small></legend>

                    {facets.projectStatus && facets.projectStatus.map((projectStatus, i) => (
                        <div key={i}>
                            <Form.Check type={'checkbox'} id={`check-project-status-${i}`}>
                                <Form.Check.Input
                                    name="projectStatus"
                                    value={projectStatus['name']}
                                    onChange={updateFilter}
                                    className={'me-2'}
                                    checked={
                                        filter['projectStatus'] !== undefined && filter['projectStatus'].indexOf(projectStatus['name']) > -1
                                    }
                                />
                                {/* <Form.Check.Label>{projectStatus['name']} ({projectStatus['amount']})</Form.Check.Label> */}
                                <Form.Check.Label>{projectStatus['name']}</Form.Check.Label>
                            </Form.Check>
                        </div>
                    ))}
                </fieldset>
            ) : ('')}


            {facets.programmeCalls ? (
                <fieldset>
                    <legend><small>Programme Call</small></legend>

                    <div style={{margin: '5px 0px'}}>
                        <ReactSelect
                            isClearable={false}
                            isMulti
                            className="react-select"
                            classNamePrefix="select"
                            options={facets.programmeCalls}
                            // components needs the complete filter objects therefore filter these by the filter country array
                            value={
                                facets.programmeCalls.filter(function (item) {
                                    return filter['programmeCall'] !== undefined && filter['programmeCall'].indexOf(item.name) > -1;
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
                                updatedValues['programmeCall'] = choices.map((choice: { name: string; amount: number }) => choice.name);
                                setFilter((prevState: any) => ({
                                    ...prevState, ...updatedValues
                                }))
                                updateHash();
                            }}
                        />
                    </div>
                </fieldset>
            ) : ('')}

            {facets.clusters ? (
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
                                        filter['clusters'] !== undefined && filter['clusters'].indexOf(cluster['name']) > -1
                                    }
                                />
                                <Form.Check.Label>{cluster['name']}</Form.Check.Label>
                            </Form.Check>
                        </div>
                    ))}
                </fieldset>
            ) : ('')}

            {yearsFilterOptions ? (
                <fieldset>
                    <legend><small>Years</small></legend>

                    <div style={{margin: '5px 0px'}}>
                        <ReactSelect
                            isClearable={false}
                            isMulti
                            className="react-select"
                            classNamePrefix="select"
                            options={yearsFilterOptions}
                            value={yearsFilterOptions.filter(function (option) {
                                return filter['year'] !== undefined && filter['year'].indexOf(option.value) > -1;
                            })}
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
                </fieldset>
            ) : ('')}
        </>
    )


}

export default PartnerFacets;