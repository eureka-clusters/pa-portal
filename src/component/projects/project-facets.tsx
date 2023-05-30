import {FC, useContext} from 'react';
import {Form} from "react-bootstrap";
// import BootstrapSwitchButton from "bootstrap-switch-button-react";
import RS from 'react-select';
import {FacetValues} from "@/interface/statistics/facet-values";
import {Facets} from "@/interface/statistics/project/facets";
import {useQuery} from "@tanstack/react-query";
import {AxiosContext} from "@/providers/axios-provider";
import {getProjectFacets} from "@/hooks/project/get-facets";

interface Props {
    facetValues: FacetValues,
    setFilter: (facetValues: (prevState: FacetValues) => FacetValues) => void,
    updateFilter: (facetValues: any) => void,
}


const ProjectFacets: FC<Props> = ({facetValues, setFilter, updateFilter}) => {

    const authAxios = useContext(AxiosContext).authAxios;

    const {isLoading, isError, data} = useQuery({
        queryKey: ['projectFacets', facetValues],
        keepPreviousData: true,
        queryFn: () => getProjectFacets({authAxios, facetValues})
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    //https://github.com/vitejs/vite/issues/2139#issuecomment-1230773695
    const ReactSelect = (RS as any).default ? (RS as any).default : RS;

    let facets: Facets = data;

    return (
        data && <>
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
                            facets.countries.filter(function (itm) {
                                return facetValues['country'] !== undefined && facetValues['country'].indexOf(itm.id) > -1;
                            })
                        }

                        getOptionLabel={(option: { name: any; }) => `${option.name}`}
                        getOptionValue={(option: { [x: string]: any; }) => `${option['id']}`}

                        closeMenuOnSelect={false}
                        onChange={(choices: any) => {
                            let updatedValues: { [key: string]: Array<string> } = {};
                            // get the names of the selected choices
                            updatedValues['country'] = choices.map((choice: {
                                id: number;
                                name: string;
                                amount: number
                            }) => choice.id);
                            setFilter((prevState: any) => ({
                                ...prevState, ...updatedValues
                            }))
                        }}
                    />
                </div>
            </fieldset>

            <fieldset>
                <legend><small>Organisation type</small></legend>

                {/*<BootstrapSwitchButton checked={filter['organisationTypeMethod'] === 'and'}*/}
                {/*                       size="sm"*/}
                {/*                       onlabel={"and"}*/}
                {/*                       offlabel={"or"}*/}
                {/*                       onstyle={'primary'}*/}
                {/*                       offstyle={'secondary'} onChange={updateOrganisationTypeMethod}/>*/}

                {facets.organisationTypes && facets.organisationTypes.map((organisationType, i) => (
                    <div key={i}>
                        <Form.Check type={'checkbox'} id={`check-type-${i}`}>
                            <Form.Check.Input
                                name="organisationType"
                                value={organisationType['id']}
                                onChange={updateFilter}
                                className={'me-2'}
                                checked={
                                    facetValues['organisationType'] !== undefined && facetValues['organisationType'].indexOf(organisationType['id'].toString()) > -1
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
                                value={projectStatus['id']}
                                onChange={updateFilter}
                                className={'me-2'}
                                checked={
                                    facetValues['projectStatus'] !== undefined && facetValues['projectStatus'].indexOf(projectStatus['id'].toString()) > -1
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
                                return facetValues['programmeCall'] !== undefined && facetValues['programmeCall'].indexOf(itm.id.toString()) > -1;
                            })
                        }
                        // getOptionLabel={(option) => `${option.name} (${option.amount})`}
                        getOptionLabel={(option: { name: any; }) => `${option.name}`}
                        getOptionValue={(option: { [x: string]: any; }) => `${option['id']}`}
                        closeMenuOnSelect={false}
                        onChange={(choices: any) => {
                            let updatedValues: { [key: string]: Array<string> } = {};
                            // get the names of the selected choices
                            updatedValues['programmeCall'] = choices.map((choice: {
                                id: string;
                                name: string;
                                amount: number
                            }) => choice.id);
                            setFilter((prevState: any) => ({
                                ...prevState, ...updatedValues
                            }))
                        }}
                    />
                </div>
            </fieldset>

            <fieldset>
                <legend><small>Clusters</small></legend>

                {facets.clusterGroups && facets.clusterGroups.map((clusterGroup, i) => (
                    <div key={i}>
                        <Form.Check type={'checkbox'} id={`check-cluster-${i}`}>
                            <Form.Check.Input
                                name="clusterGroups"
                                value={clusterGroup['id']}
                                onChange={updateFilter}
                                className={'filter'}
                                checked={
                                    facetValues.clusterGroups !== undefined && facetValues['clusterGroups'].indexOf(clusterGroup['id'].toString()) > -1
                                }
                            />
                            <Form.Check.Label>{clusterGroup['name']}</Form.Check.Label>
                        </Form.Check>
                    </div>
                ))}
            </fieldset>
        </>
    )
}

export default ProjectFacets;