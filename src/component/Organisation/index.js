import React from 'react';
import { apiStates, Api, ApiError } from '../../function/Api';
import { Link } from "react-router-dom";
import PartnerTable from './partner-table';
import BreadcrumbTree from '../partial/BreadcrumbTree'


export default function Organisation(props) {

    const slug = props.match.params.slug;
    const { state, error, data } = Api('/view/organisation/' + slug);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <p>Debug:</p><PrintObject value={data} /> */}
                    <BreadcrumbTree current="organisation" data={data} linkCurrent={false} />

                    <h1>{data.name}</h1>

                    <dl className="row">

                        <dt className="col-sm-3">Organisation:</dt>
                        <dd className="col-sm-9"><Link to={`/organisation/${data.id}/${data.name}`}>{data.name}</Link></dd>

                        <dt className="col-sm-3">Type:</dt>
                        <dd className="col-sm-9">{data.type.type}</dd>

                        <dt className="col-sm-3">Country:</dt>
                        <dd className="col-sm-9">{data.country.country}</dd>

                    </dl>

                    <PartnerTable organisation={data} />

                </React.Fragment>
            );
        default:
            return <p>Loading organisation...</p>;
    }
}