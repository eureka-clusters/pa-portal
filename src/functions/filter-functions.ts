import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export type FilterOptions = {
    filter: string,
    page: string,
    pageSize: string,
    sort: string,
    order: string
}

export function useQuery(): FilterOptions {
    const { search } = useLocation();

    return useMemo(() => {
        let searchParams = new URLSearchParams(search)

        return {
            filter: searchParams.get('filter') || '',
            page: (searchParams.get('page') || '1'),
            pageSize: (searchParams.get('pageSize') || '30'),
            sort: searchParams.get('sort') || '',
            order: searchParams.get('order') || ''
        }
    }, [search]);
}