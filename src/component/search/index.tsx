import React, {useEffect, useState} from 'react';
import './search.scss';
import {useQuery} from "@/functions/filter-functions";
import {useGetSearchResults} from "@/hooks/search/use-get-search-results";
import SearchList from "@/component/search/search-list";
import {Form} from "react-bootstrap";

export default function Search() {

    const filterOptions = useQuery();

    const [searchText, setSearchText] = useState<string>('');
    const [searching, setSearching] = useState<boolean>(false);


    let {state, setLocalFilterOptions} = useGetSearchResults({filterOptions});

    useEffect(() => {
        setSearchText(filterOptions.query);

        setTimeout(() => {
            setLocalFilterOptions(filterOptions);
            setSearching(false);
        }, 1000);
    }, [filterOptions]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setSearchText(value);
        setSearching(true);
        //Update search with delay
        setTimeout(() => {
            setLocalFilterOptions({...filterOptions, query: value});
            setSearching(false);
        }, 1000);
    };

    return (
        <>
            <h1>Search</h1>
            <Form.Label htmlFor="search">Search query</Form.Label>
            <Form.Control
                type="search"
                name="searchText"
                id="search"
                value={searchText}
                aria-describedby="searchHelpBlock"
                onChange={handleInput}
            />
            <Form.Text id="searchHelpBlock" muted>
                Start typing to search
            </Form.Text>

            {searching && <p>Searching...</p>}

            {searchText && state.data.items && <SearchList results={state.data.items} searchText={searchText}/>}
        </>
    );
}