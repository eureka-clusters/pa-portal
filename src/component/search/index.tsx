import React, {useContext, useEffect, useState} from 'react';
import './search.scss';
import {useGetFilterOptions} from "@/functions/filter-functions";
import {getSearchResults} from "@/hooks/search/get-search-results";
import SearchList from "@/component/search/search-list";
import {Form} from "react-bootstrap";
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery} from "@tanstack/react-query";

export default function Search() {

    const filterOptions = useGetFilterOptions();

    const [searchText, setSearchText] = useState<string>('');
    const [searching, setSearching] = useState<boolean>(false);

    const authAxios = useContext(AxiosContext).authAxios;

    const {isLoading, isError, data} = useQuery({
        queryKey: ['searchResults', filterOptions, searchText],
        keepPreviousData: true,
        enabled: !searching,
        queryFn: () => getSearchResults({authAxios, filterOptions, query: searchText, page: 1})
    });


    useEffect(() => {
        setSearchText(filterOptions.query);

        setTimeout(() => {
            setSearching(false);
        }, 1000);
    }, [filterOptions]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;

        setSearchText(value);
        setSearching(true);
        //Update search with delay
        setTimeout(() => {
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

            {searchText && data?.results && <SearchList results={data.results} searchText={searchText}/>}
        </>
    );
}