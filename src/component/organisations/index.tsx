import React, {useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Organisation} from "@/interface/organisation";
import {getOrganisations} from "@/hooks/organisation/get-organisations";
import {useGetFilterOptions} from '@/functions/filter-functions';
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import SortableTableHeader from '@/component/partial/sortable-table-header';
import {Button} from "react-bootstrap";

export default function Organisations() {

    const queryClient = useQueryClient()
    const filterOptions = useGetFilterOptions();
    const authAxios = useContext(AxiosContext).authAxios;
    const [page, setPage] = React.useState(1)

    const {status, data, error, isFetching, isPreviousData} = useQuery({
        queryKey: ['organisations', filterOptions, page],
        keepPreviousData: true,
        staleTime: 5000,
        queryFn: () => getOrganisations({authAxios, filterOptions, page})
    });

    useEffect(() => {
        if (!isPreviousData && data?.nextPage) {
            queryClient.prefetchQuery({
                queryKey: ['organisations', filterOptions, page + 1],
                queryFn: () => getOrganisations({authAxios, filterOptions, page: page + 1}),
            })
        }
    }, [data, isPreviousData, page, queryClient])

    return (
        <React.Fragment>
            {status === 'loading' ? (
                <div>Loading...</div>
            ) : status === 'error' ? (
                <div>Something went wrong</div>
            ) : (

                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th><SortableTableHeader order='name' filterOptions={filterOptions}>Name</SortableTableHeader>
                        </th>
                        <th><SortableTableHeader order='country'
                                                 filterOptions={filterOptions}>Country</SortableTableHeader>
                        </th>
                        <th><SortableTableHeader order='type' filterOptions={filterOptions}>Type</SortableTableHeader>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.organisations?.map(
                        (organisation: Organisation, key: number) => (
                            <tr key={key}>
                                <td><Link to={`/organisations/${organisation.slug}`}>{organisation.name}</Link></td>
                                <td>{organisation.country.country}</td>
                                <td>{organisation.type.type}</td>
                            </tr>
                        )
                    )}
                    </tbody>
                </table>
            )}
            <div>Current Page: {page}</div>
            <Button variant={'primary'}
                    onClick={() => setPage((old) => Math.max(old - 1, 0))}
                    disabled={page === 1}
            >
                Previous Page
            </Button>
            {' '}
            <Button variant={'primary'}
                    onClick={() => {
                        setPage((old) => (data?.nextPage ? old + 1 : old))
                    }}
                    disabled={isPreviousData || !data?.nextPage}
            >
                Next Page
            </Button>
            {
                // Since the last page's data potentially sticks around between page requests,
                // we can use `isFetching` to show a background loading
                // indicator since our `status === 'loading'` state won't be triggered
                isFetching ? <span> Loading...</span> : null
            }
        </React.Fragment>
    )

}