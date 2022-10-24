import {useEffect} from 'react';
import useState from 'react-usestateref'; // we need the useState with the .current href
import {fromFilter, getFilter} from 'function/api/filter-functions';


//For now quite impossible to convert to TS as all params and objects are everywhere

function TableFilter({hash, defaultFilter}: { hash: string | undefined, defaultFilter: any }) {

    const getFilterFromHash = (hash: string | undefined, setFilterMethod: boolean | undefined, useAsFilter = false) => {
        if (hash) {
            const hash = fromFilter(hash.substring(1));
            const newFilter = JSON.parse(hash);
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
        props.history.push({
            'hash': hash
        });
    }

    // update the filter depending on the hash in the url
    useEffect(() => {
        getFilterFromHash(setFilter, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    return {getDefaultFilter, getFilterFromHash, updateHash, updateFilter, filter, setFilter};
}

export default TableFilter;
