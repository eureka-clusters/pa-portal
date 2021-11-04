import React, { useEffect } from 'react';
import useState from 'react-usestateref';
import { getFilter} from '../Api';

function TableFilter({ props, defaultFilter}) {

    const getFilterFromHash = (setFilterMethod, useAsFilter = false) => {
        if (props.location.hash) {
            var hash = atob(props.location.hash.substring(1));
            var newFilter = JSON.parse(hash);
            console.log(['filter from hash', newFilter]);
            if (useAsFilter && typeof setFilterMethod == "function") {
                // console.log('filter set');
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
        var name = target.name;
        var value = target.value;
        var updatedValues = {};

        if (target.type === 'checkbox') {
            // slice is required otherwise currentValue would be reference to filter[name] and any modification will change filter directly
            var currentValue = filter[name].slice();
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
        let merged = { ...defaultFilter, ...getFilterFromHash() };
        return merged;
    }

    const [filter, setFilter, filter_ref] = useState(() => getDefaultFilter());

    const updateHash = () => {
        var hash = getFilter(filter_ref.current);
        props.history.push({
            'hash': hash
        });
    }

    // update the filter depending on the hash in the url
    useEffect(() => {
        getFilterFromHash(setFilter, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.location.hash]);

    const filtertest = (
        <>
            <h1>TableFilter</h1>
            {/* <pre className='debug'>{JSON.stringify(props, undefined, 2)}</pre> */}
            {/* <pre className='debug'>{JSON.stringify(defaultFilter, undefined, 2)}</pre> */}
            <pre className='debug'>{JSON.stringify(filter, undefined, 2)}</pre>
        </>
    );
    
    return { filtertest, getDefaultFilter, getFilterFromHash, updateHash, updateFilter, filter, setFilter };
}

export default TableFilter;
