import React, {useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";

function Search() {

    let navigate = useNavigate();

    const [searchText, setSearchText] = useState("");
    const divRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);

    const onSearch = async (text: string) => {
        // change the url to the search page with the given query
        navigate({
            pathname: "/search",
            search: `query=${text}`, // url /search?query=text
        });
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setSearchText(text);
    };


    const handleSearchClick = () => {
        onSearch(searchText).then(() => {
            return;
        });
    }

    return (
        <div
            className='col-12 col-lg-auto mb-3 mb-lg-0'
        >
            <div
                className='search-bar'
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
            </div>
        </div>
    );
}

export default Search;

