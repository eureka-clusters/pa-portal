import React from 'react';
import SearchListEntry, {itemProps} from './search-list-entry';

export default function SearchList({results, searchText}: { results: Array<any>, searchText: string }) {
    let data = [];

    if (results) {
        data = results;
    }

    const numRows = data.length
    let noResults = <>
        <p>Your search for '{searchText}' did not match any items.</p>
        {searchText.length < 3 && <p><strong>Note:</strong> Currently minimum required char length is 3.</p>}
    </>
    return (
        <>
            <ul className="list-group search-bar-results">
                {data.length > 0 && data.map((item: itemProps, index: number) => (
                    <SearchListEntry key={index} item={item} searchText={searchText}/>
                ))}
                {data.length === 0 ? noResults : null}
            </ul>
            {numRows ? <p className='text-end'>Number of results on page = {numRows}</p> : null}
        </>
    );
}

