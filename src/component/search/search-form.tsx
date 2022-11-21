import React, {useEffect, useRef, useState} from 'react';
import SearchList from './search-list';
import {useLocation, useNavigate} from "react-router-dom";
import Pagination from 'component/pagination';
import {useGetSearchResults} from "hooks/search/use-get-search-results";

const DefaultPageSize = 10;

type Props = {
    searchText: string;
    setSearchText: (query: string) => void;
}

function SearchForm({searchText, setSearchText}: Props) {

    const [currentPage, setCurrentPage] = useState<number>(1);

    const navigate = useNavigate();
    const location = useLocation();
    const limit = DefaultPageSize;

    const totalItems = 100;
    const pageSize = 10;

    useEffect(() => {
        let params = new URLSearchParams(location.search);
        let query = params.get('query');
        let page: number;

        const page_param = params.get('page');
        if (page_param) {
            page = +page_param; // + converts to in
        } else {
            page = 1;
        }

        setSearchText(query as string);
        setCurrentPage(page);
        onSearch(query as string, page);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText, location]);

    const [requestedSearchText, setRequestedSearchText] = useState<string>("");

    const divRef = useRef<HTMLDivElement>(null);
    const ulRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);
    const [showResults, setShowResults] = useState(false);

    let {state} = useGetSearchResults({query: searchText, page: currentPage, pageSize: limit});

    let results = state.data;

    const changeUrl = (query: string, page: number) => {
        // change the current url
        navigate({
            pathname: "/search",
            // search: `query=${query}`, // url /search?query=text
            search: `query=${query}&page=${page}`, // url /search?query=text
        });
    };

    const onSearch = async (query: string, page: number) => {
        // if (query) {
        //     // load({ query: query, page: currentPage, pageSize: limit })
        //     await load({query: query, page: page, pageSize: limit})
        //     setRequestedSearchText(query);
        //     setShowResults(true);
        // } else {
        //     state = ApiStates.LOADING;
        //     setShowResults(false);
        // }
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setSearchText(text);
    };

    const handleSearchClick = () => {
        // onSearch(searchText);
        changeUrl(searchText, 1);
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        changeUrl(searchText, page);
    }

    let render = <>
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
    </>

    return (
        <>
            <div
                className='col-12 col-lg-auto mb-3 mb-lg-0'
            >
                <div
                    className='search-form'
                    ref={divRef}
                    style={{}}
                >
                    <div className="input-group">
                        <input
                            className="form-control"
                            value={searchText}
                            type="search"
                            onChange={handleInput}
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
                    <br/>

                    {render}

                </div>
            </div>
        </>
    );
}

export default SearchForm;

