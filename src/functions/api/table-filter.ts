import {useState} from 'react';
import {FilterValues} from "@/interface/statistics/filter-values";


function TableFilter() {

    const [filter, setFilter] = useState<FilterValues>({} as FilterValues);

    const updateFilter = (event: any) => {
        const target = event.target;

        let targetName = target.name;
        const value = target.value;
        const updatedValues: any = {...filter};

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
        filter,
        setFilter
    };
}

export default TableFilter;
