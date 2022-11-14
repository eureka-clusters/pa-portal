import React, {FC, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {CostsFormat, EffortFormat} from 'function/utils';
import {Partner} from "interface/project/partner";
import {usePartners} from 'hooks/api/statistics/partners/use-partners';
import {ApiStates, RenderApiError} from "hooks/api/api-error";
import downloadBase64File from "function/download-base64";
import LoadingButton from "component/partial/loading-button";
import axios from "axios";

interface Props {
    filter: any
}

const PartnerTable: FC<Props> = ({filter}) => {

    const [perPage, setPerPage] = useState(30); // default pageSize
    const [loading, setLoading] = useState(false);

    const [sort, setSort] = useState('partner.organisation.name'); // default sort
    const [order, setOrder] = useState('asc'); // default order

    // store the current page (needed for handleSort)
    const [currentPage, setCurrentPage] = useState(1); // default current page

    const {
        state,
        error,
        partners,
        load,
        // pageCount, 
        pageSize,
        // page, 
        totalItems
    } = usePartners(filter, 1, perPage, sort, order);

    const [isExportLoading, setIsExportButtonLoading] = useState(
        false
    );

    const handlePageChange = async (newpage: number = 1) => {
        setCurrentPage(newpage);
    }

    //@johan i wanted to get rid of this "any" for column and use the exported TableColumn interface from datatable but it doesn't work. any idea?
    // const handleSort = async (column: TableColumn, sortDirection: string) => {
    const handleSort = async (column: any, sortDirection: string) => {
        setSort(column.sortField);
        setOrder(sortDirection);
    };

    const handlePerRowsChange = async (perPage: number) => {
        setPerPage(perPage);
    };

    const loadAsync = async () => {
        setLoading(true);
        await load({
            filter: filter,
            page: currentPage,
            pageSize: perPage,
            sort,
            order
        });
        setLoading(false);
    };

    useEffect(() => {
        loadAsync();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, currentPage, perPage, sort, order]);

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

        const queryString = btoa(JSON.stringify({
            filter: filter,
            sort: sort,
            order: order,
        }));

        axios.create().get('/statistics/results/partner/download/csv?' + queryString,
        )
            .then((res: any) => {
                let extension = res.extension;
                let mimetype = res.mimetype;
                downloadBase64File(mimetype, res.download, 'Download' + extension);
            })
            .catch((err) => {
                console.error(err);
            });
    }


    const hasYearFilter = filter.year !== undefined && filter.year.length > 0;

    const columns = [
        {
            id: 'partner.project.name',
            name: 'Project',
            selector: (partner: Partner) => partner.project.name,
            format: (partner: Partner) => <Link to={`/project/${partner.project.slug}`}
                                                title={partner.project.name}>{partner.project.name}</Link>,
            sortable: true,
            sortField: 'partner.project.name',
            grow: 1,
        },
        {
            id: 'partner.organisation.name',
            name: 'Partner',
            selector: (partner: Partner) => partner.organisation.name,
            format: (partner: Partner) => <Link to={`/partner/${partner.slug}`}
                                                title={partner.organisation.name}>{partner.organisation.name}</Link>,
            sortable: true,
            sortField: 'partner.organisation.name',
            grow: 3,
        },
        {
            id: 'partner.organisation.country.country',
            name: 'Country',
            selector: (partner: Partner) => partner.organisation && partner.organisation.country ? partner.organisation.country.country : '',
            sortable: true,
            sortField: 'partner.organisation.country.country',
        },
        {
            id: 'partner.organisation.type.type',
            name: 'Type',
            selector: (partner: Partner) => partner.organisation && partner.organisation.type ? partner.organisation.type.type : '',
            sortable: true,
            sortField: 'partner.organisation.type.type',
        },

        {
            id: 'partner.latestVersionCosts',
            name: 'Partner Costs (€)',
            selector: (partner: Partner) => partner.latestVersionCosts,
            format: (partner: Partner) => <CostsFormat value={partner.latestVersionCosts} showSuffix={false}
                                                       showPrefix={false}/>,
            sortable: true,
            right: true,
            omit: hasYearFilter,
            sortField: 'partner.latestVersionCosts',
        },
        {
            id: 'partner.latestVersionEffort',
            name: 'Partner Effort (PY)',
            selector: (partner: Partner) => partner.latestVersionEffort,
            format: (partner: Partner) => <EffortFormat value={partner.latestVersionEffort} showSuffix={false}
                                                        showPrefix={false}/>,
            sortable: true,
            right: true,
            omit: hasYearFilter,
            sortField: 'partner.latestVersionEffort',
        },
        {
            id: 'partner.year',
            name: 'Year',
            selector: (partner: Partner) => partner.year,
            sortable: true,
            omit: !hasYearFilter,
            sortField: 'partner.year',
        },
        {
            id: 'partner.latestVersionCostsInYear',
            name: 'Partner Costs in Year (€)',
            selector: (partner: Partner) => partner.latestVersionCostsInYear,
            format: (partner: Partner) => <CostsFormat value={partner.latestVersionCostsInYear} showSuffix={false}
                                                       showPrefix={false}/>,
            sortable: true,
            right: true,
            omit: !hasYearFilter,
            sortField: 'partner.latestVersionCostsInYear',
        },
        {
            id: 'partner.latestVersionEffortInYear',
            name: 'Partner Effort in Year (PY)',
            selector: (partner: Partner) => partner.latestVersionEffortInYear,
            format: (partner: Partner) => <EffortFormat value={partner.latestVersionEffortInYear} showSuffix={false}
                                                        showPrefix={false}/>,
            sortable: true,
            right: true,
            omit: !hasYearFilter,
            sortField: 'partner.latestVersionEffortInYear',
        },
    ];


    switch (state) {
        case ApiStates.ERROR:
            return <RenderApiError error={error}/>
        case ApiStates.SUCCESS:
            return (
                <React.Fragment>
                    <h2>Partners</h2>


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
        default:
            return <p>Loading data...</p>;
    }
}

export default PartnerTable;