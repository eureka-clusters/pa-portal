import {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {FilterValues} from "interface/statistics/filter-values";


function TableFilter() {

    const [filter, setFilter] = useState<FilterValues>({} as FilterValues);

    let navigate = useNavigate();
    const {hash} = useParams();

    const getFilterFromHash = () => {
        console.log('Update from hash: ', hash);

        return {};
    }

    useEffect(() => {
        console.log('filter', filter);
    }, [filter]);

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

        updateHash();
    }

    const updateHash = () => {
        if (hash) {
            //navigate(hash, {replace: true});
        }
    }

    // update the filter depending on the hash in the url
    useEffect(() => {
        updateHash();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hash]);

    return {
        getFilterFromHash,
        updateHash,
        updateFilter,
        filter,
        setFilter
    };
}

export default TableFilter;
