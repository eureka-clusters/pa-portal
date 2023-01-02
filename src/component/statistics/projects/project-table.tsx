import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { CostsFormat, EffortFormat } from '@/functions/utils';
import { useGetProjects } from "@/hooks/project/use-get-projects";
import { Project } from "@/interface/project";
import downloadBase64File from "@/functions/download-base64";
import moment from 'moment';
import LoadingButton from "@/component/partial/loading-button";
import axios from "axios";
import { FilterValues } from "@/interface/statistics/filter-values";
import { useQuery } from '@/functions/filter-functions';

const ProjectTable = ({ filter }: { filter: FilterValues }) => {


    const filterOptions = useQuery();

    const { state, setLocalFilterOptions } = useGetProjects({ filterOptions });


    const [isExportLoading, setIsExportButtonLoading] = useState(false);


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


        await axios.create().get('/statistics/results/project/download/csv?' + filterOptions)
            .then((res: any) => {
                let extension = res.extension;
                let mimetype = res.mimetype;
                downloadBase64File(mimetype, res.download, 'Download' + extension);
            })
            .catch((err) => {
                console.error(err);
            });
    }


    return (
        <React.Fragment>
            <h2>Projects</h2>


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

export default ProjectTable;