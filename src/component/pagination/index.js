import React from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from './usePagination';
import './pagination.scss';
const Pagination = props => {
    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize,
        className
    } = props;

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    // if (currentPage === 0 || paginationRange.length < 2) {
    //     return null;
    // }

    if (currentPage === 0 || typeof paginationRange === 'undefined' || paginationRange.length < 2) {
        return null;
    }


    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];

    return (

        <>
        {/* <pre className='debug'>{JSON.stringify(paginationRange, undefined, 2)}</pre>     */}
        <ul
            className={classnames('pagination-container', { [className]: className })}
        >
            <li
                key="arrow-left"
                className={classnames('pagination-item', {
                    disabled: currentPage === 1
                })}
                onClick={onPrevious}
            >
                <div className="arrow left" />
            </li>
                {paginationRange.map((pageNumber, index) => {
                if (pageNumber === DOTS) {
                    return <li key={`dots-(${index})`} className="pagination-item dots">&#8230;</li>;
                }

                return (
                    <li
                        key={`page-(${pageNumber})`}
                        className={classnames('pagination-item', {
                            selected: pageNumber === currentPage
                        })}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </li>
                );
            })}
            <li
                key = "arrow-right"
                className={classnames('pagination-item', {
                    disabled: currentPage === lastPage
                })}
                onClick={onNext}
            >
                <div className="arrow right" />
            </li>
        </ul>
        </>
    );
};

export default Pagination;
