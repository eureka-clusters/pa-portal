import {useEffect, useState} from 'react';
import {fromFilter, getFilter} from 'function/api/filter-functions';
import {useNavigate} from "react-router-dom";


//For now quite impossible to convert to TS as all params and objects are everywhere

function TableFilter({hash, defaultFilter}) {

    let navigate = useNavigate();

    const getFilterFromHash = (setFilterMethod, useAsFilter = false) => {
        if (hash) {
            const newHash = fromFilter(hash.substring(1));
            const newFilter = JSON.parse(newHash);
            // console.log(['filter from hash', newFilter]);
            if (useAsFilter && typeof setFilterMethod == "function") {
                setFilterMethod(prevState => ({
                    ...prevState, ...newFilter
                }))
            }
            return newFilter;
        } else {
            // required to set the filter if browser back button changes url to /projects without any hash
            if (useAsFilter && typeof setFilterMethod == "function") {
                // set default filter when no hash is given
                setFilterMethod(prevState => ({
                    ...prevState, ...defaultFilter
                }))
            }
        }
    }

    const updateFilter = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        const updatedValues = {};

        if (target.type === 'checkbox') {
            // slice is required otherwise currentValue would be reference to filter[name] and any modification will change filter directly
            const currentValue = filter[name].slice();
            if (target.checked) {
                currentValue.push(value);
            } else {
                const index = currentValue.indexOf(value);
                currentValue.splice(index, 1);
            }
            updatedValues[name] = currentValue;
        } else {
            updatedValues[name] = value;
        }
        setFilter(prevState => ({
            ...prevState, ...updatedValues
        }))
        updateHash();
    }

    const getDefaultFilter = () => {
        return {...defaultFilter, ...getFilterFromHash()};
    }

    // const [filter, setFilter] = useState(() => getDefaultFilter());
    const [filter, setFilter, filter_ref] = useState(() => getDefaultFilter());

    const updateHash = () => {
        // const hash = getFilter(filter.current);
        const hash = getFilter(filter_ref.current);
        navigate(hash, {replace: true});
    }

    // update the filter depending on the hash in the url
    useEffect(() => {
        getFilterFromHash(setFilter, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hash]);

    return {getDefaultFilter, getFilterFromHash, updateHash, updateFilter, filter, setFilter};
}

export default TableFilter;
