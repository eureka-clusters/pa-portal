import {ChangeEventHandler, Dispatch, FC, SetStateAction} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {Form} from "react-bootstrap";
import Select from "react-select";

import {QueryState} from "@/component/partial/query-state";
import {getPartnerFacets} from "@/hooks/partner/get-facets";
import {FacetValues} from "@/interface/statistics/facet-values";
import {Facets} from "@/interface/statistics/partner/facets";
import {useAxios} from "@/providers/axios-provider";

type FacetSetter = Dispatch<SetStateAction<FacetValues>>;
type FacetChangeHandler = ChangeEventHandler<HTMLInputElement>;
type SelectOption = { id: number | string; name: string; amount: number };
type YearOption = { label: number; value: number; key: number };

interface Props {
    facetValues: FacetValues;
    setFilter: FacetSetter;
    updateFilter: FacetChangeHandler;
}

const PartnerFacets: FC<Props> = ({facetValues, setFilter, updateFilter}) => {
    const {authAxios} = useAxios();

    const {isLoading, isError, data} = useQuery({
        queryKey: ["partnerFacets", facetValues],
        placeholderData: keepPreviousData,
        queryFn: () => getPartnerFacets({authAxios, facetValues}),
    });

    if (isLoading || isError || !data) {
        return (
            <QueryState
                isLoading={isLoading}
                isError={isError || !data}
                errorMessage="The partner filters could not be loaded."
            />
        );
    }

    const facets: Facets = data;
    const yearsFilterOptions = facets.years?.map((year, index): YearOption => ({
        label: year,
        value: year,
        key: index,
    }));

    return (
        <>
            {facets.countries ? (
                <fieldset>
                    <legend><small>Countries</small></legend>

                    <div style={{margin: "5px 0"}}>
                        <Select
                            isClearable={false}
                            isMulti
                            className="react-select"
                            classNamePrefix="select"
                            options={facets.countries}
                            value={facets.countries.filter((item) => facetValues.country?.includes(item.id))}
                            getOptionLabel={(option: SelectOption) => option.name}
                            getOptionValue={(option: SelectOption) => `${option.id}`}
                            closeMenuOnSelect={false}
                            onChange={(choices) => {
                                const selectedChoices = choices ?? [];
                                setFilter((prevState) => ({
                                    ...prevState,
                                    country: selectedChoices.map((choice) => Number(choice.id)),
                                }));
                            }}
                        />
                    </div>
                </fieldset>
            ) : null}

            {facets.organisationTypes ? (
                <fieldset>
                    <legend><small>Organisation type</small></legend>

                    {facets.organisationTypes.map((organisationType) => (
                        <div key={organisationType.id}>
                            <Form.Check type="checkbox" id={`check-type-${organisationType.id}`}>
                                <Form.Check.Input
                                    name="organisationType"
                                    value={organisationType.id}
                                    className="me-2"
                                    onChange={updateFilter}
                                    checked={facetValues.organisationType?.includes(organisationType.id.toString()) ?? false}
                                />
                                <Form.Check.Label>{organisationType.name}</Form.Check.Label>
                            </Form.Check>
                        </div>
                    ))}
                </fieldset>
            ) : null}

            {facets.projectStatus ? (
                <fieldset>
                    <legend><small>Project Status</small></legend>

                    {facets.projectStatus.map((projectStatus) => (
                        <div key={projectStatus.id}>
                            <Form.Check type="checkbox" id={`check-project-status-${projectStatus.id}`}>
                                <Form.Check.Input
                                    name="projectStatus"
                                    value={projectStatus.id}
                                    onChange={updateFilter}
                                    className="me-2"
                                    checked={facetValues.projectStatus?.includes(projectStatus.id.toString()) ?? false}
                                />
                                <Form.Check.Label>{projectStatus.name}</Form.Check.Label>
                            </Form.Check>
                        </div>
                    ))}
                </fieldset>
            ) : null}

            {facets.programmeCalls ? (
                <fieldset>
                    <legend><small>Programme Call</small></legend>

                    <div style={{margin: "5px 0"}}>
                        <Select
                            isClearable={false}
                            isMulti
                            className="react-select"
                            classNamePrefix="select"
                            options={facets.programmeCalls}
                            value={facets.programmeCalls.filter((item) => facetValues.programmeCall?.includes(item.id.toString()))}
                            getOptionLabel={(option: SelectOption) => option.name}
                            getOptionValue={(option: SelectOption) => `${option.id}`}
                            closeMenuOnSelect={false}
                            onChange={(choices) => {
                                const selectedChoices = choices ?? [];
                                setFilter((prevState) => ({
                                    ...prevState,
                                    programmeCall: selectedChoices.map((choice) => `${choice.id}`),
                                }));
                            }}
                        />
                    </div>
                </fieldset>
            ) : null}

            {facets.clusterGroups ? (
                <fieldset>
                    <legend><small>Clusters</small></legend>

                    {facets.clusterGroups.map((clusterGroup) => (
                        <div key={clusterGroup.id}>
                            <Form.Check type="checkbox" id={`check-cluster-${clusterGroup.id}`}>
                                <Form.Check.Input
                                    name="clusterGroups"
                                    value={clusterGroup.id}
                                    onChange={updateFilter}
                                    className="me-2"
                                    checked={facetValues.clusterGroups?.includes(clusterGroup.id.toString()) ?? false}
                                />
                                <Form.Check.Label>{clusterGroup.name}</Form.Check.Label>
                            </Form.Check>
                        </div>
                    ))}
                </fieldset>
            ) : null}

            {yearsFilterOptions ? (
                <fieldset>
                    <legend><small>Years</small></legend>

                    <div style={{margin: "5px 0"}}>
                        <Select
                            isClearable={false}
                            isMulti
                            className="react-select"
                            classNamePrefix="select"
                            options={yearsFilterOptions}
                            value={yearsFilterOptions.filter((option) => facetValues.year?.includes(option.value))}
                            closeMenuOnSelect={false}
                            onChange={(choices) => {
                                const selectedChoices = choices ?? [];
                                setFilter((prevState) => ({
                                    ...prevState,
                                    year: selectedChoices.map((choice) => choice.value),
                                }));
                            }}
                        />
                    </div>
                </fieldset>
            ) : null}
        </>
    );
};

export default PartnerFacets;
