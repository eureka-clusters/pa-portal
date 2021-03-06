import React from 'react';
import SearchListEntry from './searchListEntry';

export default function SearchList({ results, ulRef, searchText}) {
    let data = [];

    if (results) {
        data = results;
    }

    const numRows = data.length
    let noResults = <>
        <p>Your search for '{searchText}' did not match any items. <br /><br /> 
            <strong>Note:</strong> Currently minimum required char length is 3.</p>
    </>
    return (
        <>
            <ul className="list-group search-bar-results" ref={ulRef}>
                {data.length > 0 && data.map((item, index) => (
                    <SearchListEntry key={index} item={item} searchText={searchText}/>
                ))}
                {data.length === 0 ?  noResults  : null}
            </ul>
            {numRows ? <p className='text-end'>Number of results on page = {numRows}</p> : null}
        </>
    );
}

