import {FC} from 'react';
import {Form} from "react-bootstrap";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import {default as ReactSelect} from "react-select";
import {FilterValues} from "interface/statistics/filter-values";
import {useGetPartnerFacets} from "hooks/partner/use-get-facets";
import {Facets} from "interface/statistics/project/facets";

interface Props {
    filter: FilterValues,
    setFilter: any,
    updateFilter: any,
    updateHash: any
}


const ProjectFacets: FC<Props> = ({filter, setFilter, updateFilter, updateHash}) => {

    const {state} = useGetPartnerFacets(filter);

    const updateCountryMethod = (event: any) => {
        const updatedValues = {
            countryMethod: (event ? 'and' : 'or')
        };
        setFilter((prevState: any) => ({
            ...prevState, ...updatedValues
        }))

        updateHash();
    }

    const updateOrganisationTypeMethod = (event: any) => {
        const updatedValues = {
            organisationTypeMethod: (event ? 'and' : 'or')
        };
        setFilter((prevState: any) => ({
            ...prevState, ...updatedValues
        }))

        updateHash();
    }

    let facets: Facets = state.data;

    if (state.isLoading) {
        return <div>Loading...</div>
    }

    return (
        state.data && <>
            <fieldset>
                <legend><small>Countries</small></legend>
                <BootstrapSwitchButton checked={filter['countryMethod'] === 'and'}
                                       size="sm"
                                       onlabel={"and"}
                                       offlabel={"or"}
                                       onstyle={'primary'}
                                       offstyle={'secondary'}
                                       onChange={updateCountryMethod}
                />

                <div style={{margin: '5px 0px'}}>
                    <ReactSelect
                        isClearable={false}
                        isMulti
                        className="react-select"
                        classNamePrefix="select"
                        options={facets.countries}
                        // components needs the complete filter objects therefore filter these by the filter country array
                        value={
                            facets.countries.filter(function (itm) {
                                return filter['country'] !== undefined && filter['country'].indexOf(itm.name) > -1;
                            })
                        }

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

            <fieldset>
                <legend><small>Organisation type</small></legend>

                <BootstrapSwitchButton checked={filter['organisationTypeMethod'] === 'and'}
                                       size="sm"
                                       onlabel={"and"}
                                       offlabel={"or"}
                                       onstyle={'primary'}
                                       offstyle={'secondary'} onChange={updateOrganisationTypeMethod}/>

                {facets.organisationTypes && facets.organisationTypes.map((organisationType, i) => (
                    <div key={i}>
                        <Form.Check type={'checkbox'} id={`check-type-${i}`}>
                            <Form.Check.Input
                                name="organisationType"
                                value={organisationType['name']}
                                onChange={updateFilter}
                                className={'me-2'}
                                checked={
                                    filter['organisationType'] !== undefined && filter['organisationType'].indexOf(organisationType['name']) > -1
                                }
                            />
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
                                name="projectStatus"
                                value={projectStatus['name']}
                                onChange={updateFilter}
                                className={'me-2'}
                                checked={
                                    filter['projectStatus'] !== undefined && filter['projectStatus'].indexOf(projectStatus['name']) > -1
                                }
                            />
                            <Form.Check.Label>{projectStatus['name']}</Form.Check.Label>
                        </Form.Check>
                    </div>
                ))}
            </fieldset>

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
                            facets.programmeCalls.filter(function (itm) {
                                return filter['programmeCall'] !== undefined && filter['programmeCall'].indexOf(itm.name) > -1;
                            })
                        }
                        // getOptionLabel={(option) => `${option.name} (${option.amount})`}
                        getOptionLabel={(option) => `${option.name}`}
                        getOptionValue={(option) => `${option['name']}`}

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
                                    filter['clusters'] !== undefined && filter['clusters'].indexOf(cluster['name']) > -1
                                }
                            />
                            <Form.Check.Label>{cluster['name']}</Form.Check.Label>
                        </Form.Check>
                    </div>
                ))}
            </fieldset>
        </>
    )
}

export default ProjectFacets;