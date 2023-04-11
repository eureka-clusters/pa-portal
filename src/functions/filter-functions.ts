import {useMemo} from 'react';
import {useLocation} from 'react-router-dom';

export type FilterOptions = {
    filter: string,
    query: string,
    pageSize: string,
    order: string,
    direction: string
}

export function useGetFilterOptions(): FilterOptions {
    const {search} = useLocation();

    return useMemo(() => {
        let searchParams = new URLSearchParams(search)

        return {
            filter: searchParams.get('filter') || '',
            query: searchParams.get('query') || '',
            pageSize: (searchParams.get('pageSize') || '25'),
            order: searchParams.get('order') || '',
            direction: searchParams.get('direction') || 'asc'
        }
    }, [search]);
}