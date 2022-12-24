import { FilterOptions } from "functions/filter-functions";
import { Link } from "react-router-dom";

const SortableTableHeader = ({ sort, filterOptions, children }: { sort: string, filterOptions: FilterOptions, children: any }) => {
    return (
        <Link to={{
            search: "?sort=" + sort + "&order=" + (filterOptions.order === "asc" ? "desc" : "asc")
        }}>
            {children}
        </Link>
    )
}

export default SortableTableHeader;