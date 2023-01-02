import React, {FC, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {CostsFormat, EffortFormat} from '@/functions/utils';
import {Partner} from "@/interface/project/partner";
import {useGetPartners} from "@/hooks/partner/use-get-partners";
import downloadBase64File from "@/functions/download-base64";
import LoadingButton from "@/component/partial/loading-button";
import axios from "axios";
import { Organisation } from '@/interface/organisation';
import { Project } from '@/interface/project';
import { useQuery } from '@/functions/filter-functions';

const PartnerTable = ({organisation, project}: {organisation?: Organisation, project?: Project}) => {

    const filterOptions = useQuery();

    const { state } = useGetPartners({filterOptions, organisation, project});

    const [isExportLoading, setIsExportButtonLoading] = useState(
        false
    );

  

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

        axios.create().get('/statistics/results/partner/download/csv?' + filterOptions,
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


    // const hasYearFilter = filterOptions.filter.year !== undefined && filterOptions.filter.year.length > 0;

   

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
}

export default PartnerTable;