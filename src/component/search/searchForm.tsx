import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { KeyboardEvent } from 'react';
import SearchList from './searchList';
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useSearch, apiStates, ApiError } from 'hooks/api/search/useSearch';
import Pagination from 'component/pagination';
interface stateType {
    // from: { pathname: string }
    searchResults: any
}

const DefaultPageSize = 10;

type Props = {
    searchText: string;
    setSearchText: (query: string) => void;
}
function SearchForm({ searchText, setSearchText }: Props) {

    const [currentPage, setCurrentPage] = useState<number>(1);

    const [limit, setLimit] = React.useState(DefaultPageSize); 
    let history = useHistory();

    const location = useLocation<stateType>();

    useEffect(() => {
        // console.log(['location.pathname', location.pathname]); // result: '/search'
        // console.log(['location.search', location.search]); // result: '?query=abc'
        // console.log(location.state);
        let params = new URLSearchParams(location.search);
        let query = params.get('query');
        var page: number;

        var page_param = params.get('page');
        if (page_param) {
            page = +page_param; // + converts to in
        } else {
            page = 1;
        }

        // if (query) {
        //     // get the query from the location and set it as searchText
        //     // and use it also for the search
        //     // console.log(['set setSearchText trough query param', params.get('query')]);
        //     // setSearchText(query as string);
        //     setSearchText(query as string);
        //     setCurrentPage(page);
        //     onSearch(query as string, page);
        // }

        setSearchText(query as string);
        setCurrentPage(page);
        onSearch(query as string, page);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const [requestedSearchText, setRequestedSearchText] = useState<string>("");
    
    const divRef = useRef<HTMLDivElement>(null);
    const ulRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<null | HTMLInputElement >(null);
    const [showResults, setShowResults] = useState(false);
   
    var {
        state,
        error,
        results,
        load,
        // pageCount,
        pageSize,
        // page,
        totalItems
    } = useSearch({ query: searchText, page: currentPage, pageSize: limit });


    const changeUrl = (query: string, page:number) => {
        // change the current url
        history.replace({
            pathname: "/search",
            // search: `query=${query}`, // url /search?query=text
            search: `query=${query}&page=${page}`, // url /search?query=text
        });
    };

    const onSearch = async (query: string, page:number) => {
        if (query) {
            // load({ query: query, page: currentPage, pageSize: limit })
            await load({ query: query, page: page, pageSize: limit })
            setRequestedSearchText(query);
            setShowResults(true);
        } else {
            state = apiStates.LOADING;
            setShowResults(false);
        }
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setSearchText(text);
    };

    const handleKeyboardEvent = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            // onSearch(searchText);
            changeUrl(searchText, 1);
            return;
        }
    };

    const handleSearchClick = () => {
        // onSearch(searchText);
        changeUrl(searchText, 1);
    }

    const handlePageChange = (page:number) => {
        setCurrentPage(page);
        changeUrl(searchText, page);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleLimitChange = (limit:number) => {
        setLimit(limit);
    }


    // console.log(['error', error]);
    // console.log(['results.length', results.length]);
    // console.log(['state', state]);

    let render = null;

    switch (state) {
        case apiStates.ERROR:
            render = <ApiError error={error} />
            break;
        case apiStates.SUCCESS:
            render = <>
                {showResults ? <SearchList results={results} ulRef={ulRef} searchText={requestedSearchText}/> : null}
               
                {showResults ? <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={totalItems}
                    // as the result of the api query doesn't use given pageSize for the limit i must use the returned pageSize to get correct pagination.
                    // pageSize={limit}  
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                /> : null}

                {/*<u>debug:</u><br />*/}
                {/*pageCount: {pageCount} <br />*/}
                {/*pageSize: {pageSize} <br />*/}
                {/*page: {page} <br />*/}
                {/*totalItems: {totalItems}<br />*/}
                {/*limit: {limit} <br />*/}
            </>
            break;
        default:
            render = <></>
            // render = <p>Loading ...</p>;
    }
    
    return (
        <>
        {/* <pre className='debug'>{JSON.stringify(results, undefined, 2)}</pre> */}
        <div
            className='col-12 col-lg-auto mb-3 mb-lg-0' 
            >
            <div
                className='search-form' 
                ref={divRef} 
                style={{ 
                   
                }}
            >
                <div className="input-group">
                    <input
                        className="form-control"
                        value={searchText}
                        type="search"
                        onChange={handleInput}
                        onKeyPress={(e) => handleKeyboardEvent(e)}
                        placeholder="Search..."
                        aria-label="Search"
                        aria-describedby="search-button"
                        ref={inputRef}
                    />
                    <button
                        className="btn btn-outline-primary"
                        // className="btn btn-outline-secondary"
                        // className="btn btn-primary"
                        type="button"
                        id="search-button"
                        onClick={handleSearchClick}
                    >
                        Search
                        <i className="fas fa-search"></i>
                    </button>
                </div>
                <br />

                {render}

            </div>
        </div>
        </>
    );
}

export default SearchForm;

