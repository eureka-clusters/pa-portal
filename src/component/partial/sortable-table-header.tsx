import {FilterOptions} from "@/functions/filter-functions";
import {Link} from "react-router-dom";

const SortableTableHeader = (
    {
        order,
        filterOptions,
        children
    }: {
        order: string,
        filterOptions: FilterOptions,
        children: any
    }) => {
    return (
        <Link to={{
            search: "?order=" + order + "&direction=" + (filterOptions.direction === "asc" ? "desc" : "asc")
        }}>
            {children}
        </Link>
    )
}

export default SortableTableHeader;