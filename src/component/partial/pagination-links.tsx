import Pagination from 'react-bootstrap/Pagination';
import {Link} from "react-router-dom";

const PaginationLinks = ({data}: { data: any, }) => {

    let items = [];
    for (let number = 1; number <= data.amountOfPages; number++) {
        items.push(
            <li className={data.currentPage === number ? 'page-item active' : 'page-item'} key={number}>
                <Link className={'page-link'} to={`?page=${number}`}>{number}</Link>
            </li>
        );
    }

    return <Pagination size="sm">{items}</Pagination>;
}

export default PaginationLinks;
