import React, {useContext, useEffect, useState} from 'react';
import {useGetPartners} from "@/hooks/partner/use-get-partners";
import downloadBase64File from "@/functions/download-base64";
import LoadingButton from "@/component/partial/loading-button";
import {useQuery} from '@/functions/filter-functions';
import {FilterValues} from "@/interface/statistics/filter-values";
import SortableTableHeader from "@/component/partial/sortable-table-header";
import {Partner} from "@/interface/project/partner";
import {createSearchParams, Link} from "react-router-dom";
import PaginationLinks from "@/component/partial/pagination-links";
import {AxiosContext} from "@/providers/axios-provider";

const PartnerTable = ({filter}: { filter: FilterValues }) => {

    const filterOptions = useQuery();
    const axiosContext = useContext(AxiosContext);

    const {state, setLocalFilterOptions} = useGetPartners({filterOptions});
    const [isExportLoading, setIsExportButtonLoading] = useState(
        false
    );

    useEffect(() => {

        //Add the filter (bzipped) to the filterOptions
        filterOptions.filter = btoa(JSON.stringify(filter));

        setLocalFilterOptions({...filterOptions, filter: btoa(JSON.stringify(filter))});

    }, [filterOptions, filter]);

    function setPage(page: string) {
        setLocalFilterOptions({...filterOptions, page});
    }


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

        axiosContext.authAxios.get('/statistics/results/partner/download/csv?' + createSearchParams(filterOptions),
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


    // const hasYearFilter = filterOptions.filter.year !== undefined && filterOptions.filter.year.length > 0;


    return (
        <React.Fragment>
            <h2>Partners</h2>

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>#</th>
                    <th><SortableTableHeader sort='name'
                                             filterOptions={filterOptions}>Organisation</SortableTableHeader>
                    </th>
                    <th><SortableTableHeader sort='project'
                                             filterOptions={filterOptions}>Project</SortableTableHeader></th>
                    <th><SortableTableHeader sort='secondary_cluster' filterOptions={filterOptions}>Primary
                        cluster</SortableTableHeader></th>
                    <th><SortableTableHeader sort='country'
                                             filterOptions={filterOptions}>Country</SortableTableHeader>
                    </th>
                    <th><SortableTableHeader sort='type'
                                             filterOptions={filterOptions}>Type</SortableTableHeader>
                    </th>
                </tr>
                </thead>
                <tbody>
                {state.data.items && state.data.items.map(
                    (partner: Partner, key: number) => (
                        <tr key={key}>
                            <td><small className="text-muted">{partner.id}</small></td>
                            <td><Link to={`/projects/partner/${partner.slug}`}>{partner.organisation.name}</Link></td>
                            <td><Link to={`/projects/${partner.project.slug}`}>{partner.project.name}</Link></td>
                            <td>{partner.project.primaryCluster.name}</td>
                            <td>{partner.organisation.country.country}</td>
                            <td>{partner.organisation.type.type}</td>
                        </tr>
                    )
                )}
                </tbody>
            </table>

            <PaginationLinks state={state} setPage={setPage}/>


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
    );
}

export default PartnerTable;