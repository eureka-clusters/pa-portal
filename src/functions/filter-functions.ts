import {useMemo} from 'react';
import {useLocation} from 'react-router-dom';

export type FilterOptions = {
    filter: string,
    page: string,
    query: string,
    pageSize: string,
    sort: string,
    order: string
}

export type ListResponse<T> = {
    items: T[],
    page: number,
    page_count: number,
    total_items: number
}

export function useGetFilterOptions(): FilterOptions {
    const {search} = useLocation();

    return useMemo(() => {
        let searchParams = new URLSearchParams(search)

        return {
            filter: searchParams.get('filter') || '',
            query: searchParams.get('query') || '',
            page: (searchParams.get('page') || '1'),
            pageSize: (searchParams.get('pageSize') || '30'),
            sort: searchParams.get('sort') || '',
            order: searchParams.get('order') || ''
        }
    }, [search]);
}