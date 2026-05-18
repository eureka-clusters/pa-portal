import SearchListEntry, {itemProps} from './search-list-entry';

export default function SearchList({results, searchText}: { results: itemProps[]; searchText: string }) {
    const numRows = results.length;

    return (
        <>
            <ul className="list-group search-bar-results">
                {results.length > 0 && results.map((item) => (
                    <SearchListEntry key={`${item.type}-${item.slug}`} item={item} searchText={searchText}/>
                ))}
                {results.length === 0 ? (
                    <>
                        <p>Your search for '{searchText}' did not match any items.</p>
                        {searchText.length < 3 ? <p><strong>Note:</strong> Currently minimum required char length is 3.</p> : null}
                    </>
                ) : null}
            </ul>
            {numRows ? <p className='text-end'>Number of results on page = {numRows}</p> : null}
        </>
    );
}
