import React, {useContext, useEffect, useState} from 'react';
import {getPartners} from "@/hooks/partner/get-partners";
import downloadBase64File from "@/functions/download-base64";
import LoadingButton from "@/component/partial/loading-button";
import {useGetFilterOptions} from '@/functions/filter-functions';
import {FilterValues} from "@/interface/statistics/filter-values";
import SortableTableHeader from "@/component/partial/sortable-table-header";
import {Partner} from "@/interface/project/partner";
import {Link} from "react-router-dom";
import {AxiosContext} from "@/providers/axios-provider";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Button} from "react-bootstrap";

const PartnerTable = ({filterValues}: { filterValues: FilterValues }) => {

    const queryClient = useQueryClient();
    const filterOptions = useGetFilterOptions();
    const axiosContext = useContext(AxiosContext);
    const [isExportLoading, setIsExportButtonLoading] = useState(false);
    const authAxios = useContext(AxiosContext).authAxios;
    const [page, setPage] = React.useState(1)

    const {status, data, error, isFetching, isPreviousData} = useQuery({
        queryKey: ['partnerStatistics', filterOptions, filterValues, page],
        keepPreviousData: false,
        queryFn: () => getPartners({authAxios, filterOptions, filterValues, page})
    });

    useEffect(() => {
        if (!isPreviousData && data?.nextPage) {
            queryClient.prefetchQuery({
                queryKey: ['partnerStatistics', filterOptions, filterValues, page + 1],
                queryFn: () => getPartners({authAxios, filterOptions, filterValues, page: page + 1}),
            })
        }
    }, [data, isPreviousData, page, queryClient])

    useEffect(() => {
        if (isExportLoading) {
            // start the download
            (async () => {
                await downloadExcel().then(() => {
                    setIsExportButtonLoading(false);
                });
            })();
        }
        // downloadExcel couldn't been added
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExportLoading]);

    const downloadExcel = async () => {

        axiosContext.authAxios.get('/statistics/results/partner/download/' + filterOptions.filter,
        )
            .then((res: any) => {
                let extension = res.data.extension;
                let mimetype = res.data.mimetype;
                downloadBase64File(mimetype, res.data.download, 'Download' + extension);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    return (
        <React.Fragment>
            {status === 'loading' ? (
                <div>Loading...</div>
            ) : status === 'error' ? (
                <div>Something went wrong</div>
            ) : (
                <React.Fragment>
                    <h2>Partners</h2>

                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th><SortableTableHeader order='name'
                                                     filterOptions={filterOptions}>Organisation</SortableTableHeader>
                            </th>
                            <th><SortableTableHeader order='project'
                                                     filterOptions={filterOptions}>Project</SortableTableHeader></th>
                            <th><SortableTableHeader order='primary_cluster' filterOptions={filterOptions}>Primary
                                cluster</SortableTableHeader></th>
                            <th><SortableTableHeader order='secondary_cluster' filterOptions={filterOptions}>Secondary
                                cluster</SortableTableHeader></th>
                            <th><SortableTableHeader order='country'
                                                     filterOptions={filterOptions}>Country</SortableTableHeader>
                            </th>
                            <th><SortableTableHeader order='type'
                                                     filterOptions={filterOptions}>Type</SortableTableHeader>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.partners?.map(
                            (partner: Partner, key: number) => (
                                <tr key={key}>
                                    <td><Link
                                        to={`/projects/partner/${partner.slug}`}>{partner.organisation.name}</Link></td>
                                    <td><Link to={`/projects/${partner.project.slug}`}>{partner.project.name}</Link>
                                    </td>
                                    <td>{partner.project.primaryCluster.name}</td>
                                    <td>{partner.project.secondaryCluster?.name}</td>
                                    <td>{partner.organisation.country.country}</td>
                                    <td>{partner.organisation.type.type}</td>
                                </tr>
                            )
                        )}
                        </tbody>
                    </table>


                    <div className="datatable-download">
                        <LoadingButton
                            isLoading={isExportLoading}
                            loadingText='Exporting...'
                            onClick={() => setIsExportButtonLoading(true)}
                        >
                            Export to Excel
                        </LoadingButton>
                    </div>

                </React.Fragment>
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
    );

}

export default PartnerTable;