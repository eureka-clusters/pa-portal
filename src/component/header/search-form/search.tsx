import React from 'react';
import { useState, useRef } from 'react';
import { KeyboardEvent } from 'react';
import { useHistory } from "react-router-dom";

function Search() {

    let history = useHistory();

    const [searchText, setSearchText] = useState("");
    const divRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<null | HTMLInputElement >(null);

    const onSearch = async (text: string) => {
        // change the url to the search page with the given query
        history.replace({
            pathname: "/search",
            search: `query=${text}`, // url /search?query=text
            
            // test so set result data per state directly
            // state: {
            //     searchResults: data._embedded.results,
            // },
        });
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setSearchText(text);
    };

    const handleKeyboardEvent = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch(searchText);
            return;
        }
    };

    const handleSearchClick = () => {
        onSearch(searchText);
    }

    return (

        
        <div
            className='col-12 col-lg-auto mb-3 mb-lg-0' 
            >
            <div
                className='search-bar' 
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
            </div>
        </div>
    );
}

export default Search;

