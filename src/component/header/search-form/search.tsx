import {FormEvent, useEffect, useState} from "react";
import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom";

function Search() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchText, setSearchText] = useState(searchParams.get("query") ?? "");

    useEffect(() => {
        setSearchText(searchParams.get("query") ?? "");
    }, [searchParams]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const query = searchText.trim();

        navigate({
            pathname: "/search",
            search: createSearchParams(query ? {query} : {}).toString(),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-group">
                <input
                    className="form-control"
                    value={searchText}
                    type="search"
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search..."
                    aria-label="Search"
                    aria-describedby="search-button"
                />
                <button className="btn btn-outline-primary" type="submit" id="search-button">
                    Search
                </button>
            </div>
        </form>
    );
}

export default Search;
