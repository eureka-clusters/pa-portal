import {useMemo} from 'react';
import {useLocation} from 'react-router-dom';

export type FilterOptions = {
    filter: string,
    query: string,
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
            order: searchParams.get('order') || '',
            direction: searchParams.get('direction') || 'asc'
        }
    }, [search]);
}