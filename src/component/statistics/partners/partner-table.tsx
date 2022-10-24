import React, { useEffect, FC} from 'react';
import {Link} from "react-router-dom";
import DataTable from 'component/database-table';
import { CostsFormat, EffortFormat} from 'function/utils';
import {Partner} from "interface/project/partner";
import { getFilter } from 'function/api';
import { usePartners, apiStates, ApiError } from 'hooks/api/statistics/partners/use-partners';
import useState from 'react-usestateref';
import { useAuth } from "context/user-context";
import downloadBase64File from "function/download-base64";
import { GetServerUri, objToQueryString } from 'function/api';
import LoadingButton from "component/partial/loading-button";

interface Props {
    filter: any
}

const PartnerTable: FC<Props> = ({filter}) => {

    let auth = useAuth();

    const [perPage, setPerPage] = useState(30); // default pageSize
    const [loading, setLoading] = useState(false);
    
    const [sort, setSort, sort_ref] = useState('partner.organisation.name'); // default sort
    const [order, setOrder, order_ref] = useState('asc'); // default order

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
    } = usePartners({ filter: getFilter(filter), page: 1, pageSize: perPage, sort: sort, order: order });
    
    const [isExportLoading, setIsExportButtonLoading] = React.useState(
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

    const handlePerRowsChange = async (perPage: number, page: number) => {
        setPerPage(perPage);
    };

    const loadAsync = async () => {
        setLoading(true);
        await load({
            filter: getFilter(filter),
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
    }, [currentPage, perPage, sort, order]);

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
        const serverUri = GetServerUri();
        let jwtToken = auth.getJwtToken();

        const queryString = objToQueryString({
            filter: getFilter(filter),
            sort: sort,
            order: order,
        });

        await fetch(serverUri + '/api/statistics/results/partner/download/csv?' + queryString,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                }
            }
        )
        .then(res => {
            if (!res.ok) { throw res }
            return res.json()
        })
        .then((res) => {
            let extension = res.extension;
            let mimetype = res.mimetype;
            downloadBase64File(mimetype, res.download, 'Download' + extension);
        })
        .catch((err) => {
            console.error(err);
        });
    }


    const hasYearFilter = filter.year.length > 0;

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
            format: (partner: Partner) => <CostsFormat value={partner.latestVersionCosts} showSuffix={false} showPrefix={false}/>,
            sortable: true,
            right: true,
            omit: hasYearFilter,
            sortField: 'partner.latestVersionCosts',
        },
        {
            id: 'partner.latestVersionEffort',
            name: 'Partner Effort (PY)',
            selector: (partner: Partner) => partner.latestVersionEffort,
            format: (partner: Partner) => <EffortFormat value={partner.latestVersionEffort} showSuffix={false} showPrefix={false}/>,
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
            format: (partner: Partner) => <CostsFormat value={partner.latestVersionCostsInYear} showSuffix={false} showPrefix={false}/>,
            sortable: true,
            right: true,
            omit: !hasYearFilter,
            sortField: 'partner.latestVersionCostsInYear',
        },
        {
            id: 'partner.latestVersionEffortInYear',
            name: 'Partner Effort in Year (PY)',
            selector: (partner: Partner) => partner.latestVersionEffortInYear,
            format: (partner: Partner) => <EffortFormat value={partner.latestVersionEffortInYear} showSuffix={false} showPrefix={false}/>,
            sortable: true,
            right: true,
            omit: !hasYearFilter,
            sortField: 'partner.latestVersionEffortInYear',
        },
    ];


    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error}/>
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    <h2>Partners</h2>
                    {/* <pre className='debug'>{JSON.stringify(partners.length, undefined, 2)}</pre> */}
                    {/* <pre className='debug'>{JSON.stringify(partners, undefined, 2)}</pre> */}
                    {/* <pre className='debug'>{JSON.stringify(getFilter(filter), undefined, 2)}</pre> */}
                    {/* <pre className='debug'>{JSON.stringify(filter, undefined, 2)}</pre> */}
                    
                    <DataTable
                        // title="Partners"
                        keyField={hasYearFilter ? ("keyfield"): ("id")}

                        columns={columns}
                        data={partners}
                        paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100, 200]}

                        defaultSortFieldId={sort_ref.current}
                        defaultSortAsc={order_ref.current === 'asc' ? true : false}


                        progressPending={loading}
                        pagination
                        // paginationDefaultPage = {currentPage}
                        paginationServer
                        paginationPerPage={pageSize}
                        paginationTotalRows={totalItems}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                        sortServer
                        onSort={handleSort}
                    />

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