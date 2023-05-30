import {FC, useContext} from 'react';
import {Form} from "react-bootstrap";
import RS, {default as ReactSelect} from "react-select";
import {FacetValues} from "@/interface/statistics/facet-values";
import {getPartnerFacets} from "@/hooks/partner/get-facets";
import {Facets} from "@/interface/statistics/partner/facets";
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery} from "@tanstack/react-query";

interface Props {
    facetValues: FacetValues,
    setFilter: (facetValues: (prevState: FacetValues) => FacetValues) => void,
    updateFilter: (facetValues: any) => void,
}

const PartnerFacets: FC<Props> = ({facetValues, setFilter, updateFilter}) => {

    const authAxios = useContext(AxiosContext).authAxios;

    const {isLoading, isError, data} = useQuery({
        queryKey: ['partnerFacets', facetValues],
        keepPreviousData: true,
        queryFn: () => getPartnerFacets({authAxios, facetValues})
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

    const yearsFilterOptions = facets.years?.map((year: number, index: number) => {
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
            ) : ('')}

            {facets.organisationTypes ? (
                <fieldset>
                    <legend><small>Organisation type</small></legend>

                    {facets.organisationTypes && facets.organisationTypes.map((organisationType, i) => (
                        <div key={i}>
                            <Form.Check type={'checkbox'} id={`check-type-${i}`}>
                                <Form.Check.Input
                                    name="organisationType"
                                    value={organisationType['id']}
                                    className={'me-2'}
                                    onChange={updateFilter}
                                    checked={
                                        facetValues['organisationType'] !== undefined && facetValues['organisationType'].indexOf(organisationType['id'].toString()) > -1
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
                                    value={projectStatus['id']}
                                    onChange={updateFilter}
                                    className={'me-2'}
                                    checked={
                                        facetValues['projectStatus'] !== undefined && facetValues['projectStatus'].indexOf(projectStatus['id'].toString()) > -1
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
                                    return facetValues['programmeCall'] !== undefined && facetValues['programmeCall'].indexOf(item.name) > -1;
                                })
                            }
                            // getOptionLabel={(option) => `${option.name} (${option.amount})`}
                            getOptionLabel={(option: { name: any; }) => `${option.name}`}
                            getOptionValue={(option: { [x: string]: any; }) => `${option['id']}`}
                            // add the checkboxes
                            // components={{
                            //     Option
                            // }}
                            // hideSelectedOptions={false}
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
            ) : ('')}

            {facets.clusterGroups ? (
                <fieldset>
                    <legend><small>Clusters</small></legend>

                    {facets.clusterGroups && facets.clusterGroups.map((clusterGroup, i) => (
                        <div key={i}>
                            <Form.Check type={'checkbox'} id={`check-cluster-${i}`}>
                                <Form.Check.Input
                                    name="clusterGroups"
                                    value={clusterGroup['id']}
                                    onChange={updateFilter}
                                    className={'me-2'}
                                    checked={
                                        facetValues['clusterGroups'] !== undefined && facetValues['clusterGroups'].indexOf(clusterGroup['id'].toString()) > -1
                                    }
                                />
                                <Form.Check.Label>{clusterGroup['name']}</Form.Check.Label>
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
                                return facetValues['year'] !== undefined && facetValues['year'].indexOf(option.value) > -1;
                            })}
                            closeMenuOnSelect={false}
                            onChange={(choices: any) => {
                                let updatedValues: { [key: string]: Array<string> } = {};
                                // get the names of the selected choices
                                updatedValues['year'] = choices.map((choice: {
                                    label: string;
                                    value: string;
                                    key: number
                                }) => choice.value);
                                setFilter((prevState: any) => ({
                                    ...prevState, ...updatedValues
                                }))

                            }}
                        />
                    </div>
                </fieldset>
            ) : ('')}
        </>
    )


}

export default PartnerFacets;