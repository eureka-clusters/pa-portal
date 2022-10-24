import React, {useState} from 'react';
import SearchForm from './search-form';
import './search.scss';

export default function Search() {

    const [searchText, setSearchText] = useState("");

    return (
        <>
            <h1>Search</h1>
            <SearchForm searchText={searchText} setSearchText={setSearchText}/>
        </>
    )
}