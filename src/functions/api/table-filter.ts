import {ChangeEvent, useCallback, useState} from "react";

import {FacetValues} from "@/interface/statistics/facet-values";

type FilterInputEvent = ChangeEvent<HTMLInputElement>;

export function useFacetFilters() {
    const [facetValues, setFilter] = useState<FacetValues>({});

    const updateFilter = useCallback((event: FilterInputEvent) => {
        const target = event.target;
        const targetName = target.name as keyof FacetValues;
        const value = target.value;
        const updatedValues = {...facetValues};

        if (target.type === 'checkbox') {
            const currentValue = Array.isArray(updatedValues[targetName]) ? [...updatedValues[targetName]] : [];

            if (target.checked) {
                currentValue.push(value);
            } else {
                const index = currentValue.indexOf(value);
                currentValue.splice(index, 1);
            }
            updatedValues[targetName] = currentValue as never;
        } else {
            updatedValues[targetName] = value as never;
        }

        setFilter((prevState) => ({
            ...prevState, ...updatedValues
        }));
    }, [facetValues]);

    return {
        updateFilter,
        facetValues,
        setFilter
    };
}

export default useFacetFilters;
