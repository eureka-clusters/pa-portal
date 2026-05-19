import {useEffect, useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {Form, Spinner} from "react-bootstrap";

import {QueryState} from "@/component/partial/query-state";
import SearchList from "@/component/search/search-list";
import {useGetFilterOptions} from "@/functions/filter-functions";
import {getSearchResults} from "@/hooks/search/get-search-results";
import {useDebouncedValue} from "@/hooks/use-debounced-value";
import {useAxios} from "@/providers/axios-provider";

import "./search.scss";

export default function Search() {
    const {authAxios} = useAxios();
    const filterOptions = useGetFilterOptions();
    const [searchText, setSearchText] = useState(filterOptions.query);

    useEffect(() => {
        setSearchText(filterOptions.query);
    }, [filterOptions.query]);

    const debouncedSearchText = useDebouncedValue(searchText.trim(), 400);
    const isSearching = searchText.trim() !== debouncedSearchText;

    const searchQuery = useQuery({
        queryKey: ["searchResults", filterOptions, debouncedSearchText],
        placeholderData: keepPreviousData,
        enabled: debouncedSearchText.length > 0,
        queryFn: () => getSearchResults({
            authAxios,
            filterOptions,
            query: debouncedSearchText,
            page: 1,
        }),
    });

    const queryState = debouncedSearchText ? (
        <QueryState
            isLoading={searchQuery.isLoading}
            isError={searchQuery.isError}
            errorMessage="The search request could not be completed."
        />
    ) : null;

    return (
        <>
            <h1 className={'fs-1'}>Search</h1>
            <Form.Label htmlFor="search" column="sm">Search query</Form.Label>
            <Form.Control
                type="search"
                name="searchText"
                id="search"
                value={searchText}
                aria-describedby="searchHelpBlock"
                onChange={(event) => setSearchText(event.target.value)}
            />
            <Form.Text id="searchHelpBlock" muted>
                Start typing to search
            </Form.Text>

            {isSearching ? (
                <div className="d-flex align-items-center gap-2 mt-3 text-body-secondary" aria-live="polite">
                    <Spinner animation="border" size="sm" aria-hidden="true"/>
                    <span>Searching...</span>
                </div>
            ) : null}
            {queryState}
            {debouncedSearchText && searchQuery.data?.results ? (
                <SearchList results={searchQuery.data.results} searchText={debouncedSearchText}/>
            ) : null}
        </>
    );
}
