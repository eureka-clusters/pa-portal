import {useState} from 'react';
import {FacetValues} from "@/interface/statistics/facet-values";


function TableFilter() {

    const [facetValues, setFilter] = useState<FacetValues>({} as FacetValues);

    const updateFilter = (event: any) => {
        const target = event.target;

        let targetName = target.name;
        const value = target.value;
        const updatedValues: any = {...facetValues};

        if (target.type === 'checkbox') {
            // slice is required otherwise currentValue would be reference to filter[name] and any modification will change filter directly
            const currentValue = updatedValues[targetName] !== undefined ? updatedValues[targetName].slice() : [];

            if (target.checked) {
                currentValue.push(value);
            } else {
                const index = currentValue.indexOf(value);
                currentValue.splice(index, 1);
            }
            updatedValues[targetName] = currentValue;
        } else {
            updatedValues[targetName] = value;
        }

        setFilter((prevState: any) => ({
            ...prevState, ...updatedValues
        }))
    }


    return {
        updateFilter,
        facetValues,
        setFilter
    };
}

export default TableFilter;
