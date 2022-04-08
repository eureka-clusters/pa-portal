import React from 'react';
import { useState } from 'react';
import SearchForm from './searchForm';
import './search.scss';

export default function Search() {

    const [searchText, setSearchText] = useState("");
   
    return (
        <>
        <h1>Search</h1>
            <SearchForm query={searchText}/>
        </>
    )
}