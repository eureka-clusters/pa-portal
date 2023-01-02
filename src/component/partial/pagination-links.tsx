import Pagination from 'react-bootstrap/Pagination';

const PaginationLinks = ({state, setPage}: { state: any, setPage: any }) => {

    let active = state.data.page;
    let items = [];
    for (let number = 1; number <= state.data.page_count; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active} onClick={() => setPage(number)}>
                {number}
            </Pagination.Item>,
        );
    }

    return <Pagination size="sm">{items}</Pagination>;
}

export default PaginationLinks;
