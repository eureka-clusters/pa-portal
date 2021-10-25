import React from 'react';
import { apiStates, Api, ApiError } from '../../function/Api';
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import PartnerTable from './partner-table';

export const SiteMap = ({ hrefIn }) => {
    const items = [
        { href: "/projects", name: "Projects" },
        { href: "/organisation", name: "Organisation" },
    ];
    return (
        <Breadcrumb>
            {items.map((item) =>
                item.href === hrefIn ? (
                    <Breadcrumb.Item active>{item.name}</Breadcrumb.Item>
                ) : (
                    <Breadcrumb.Item linkProps={{ to: item.href }} linkAs={Link}>
                        {item.name}
                    </Breadcrumb.Item>
                )
            )}
        </Breadcrumb>
    );
};

export default function Organisation(props) {

    //'/api/view/project/' + identifier,
    const identifier = props.match.params.identifier;
    
    const url = '/view/organisation/' + identifier;

    const { state, error, data, load } = Api(url);

    switch (state) {
        case apiStates.ERROR:
            return <ApiError error={error} />
        case apiStates.SUCCESS:
            return (
                <React.Fragment>
                    {/* <p>Debug:</p>
                    <PrintObject value={data} /> */}

                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>{data.name}</Breadcrumb.Item>
                    </Breadcrumb>


                    {/* //@Johan, do you have an idea how can we could have a component where we could give variables like projectname + identifier to generate the breadcrumbs more dynamically? */}
                    <SiteMap hrefIn="/organisation" />

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