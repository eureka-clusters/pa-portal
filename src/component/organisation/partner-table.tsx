import React, {FC} from 'react';
import {Link} from "react-router-dom";
import {BooleanIconFormat, CostsFormat, EffortFormat} from 'functions/utils';
import {Partner} from "interface/project/partner";
import {Organisation} from "interface/organisation";
import {useGetPartners} from "hooks/partner/use-get-partners";
import { useQuery } from 'functions/filter-functions';
import SortableTableHeader from 'component/partial/sortable-table-header';

interface Props {
    organisation: Organisation
}

const PartnerTable: FC<Props> = ({organisation}) => {

    const filterOptions = useQuery();
    const { state, setLocalFilterOptions } = useGetPartners({ filterOptions, organisation });
    

    if (state.isLoading) {
        return <div>Loading...</div>
    }

    return (
        <React.Fragment>
            <h2>Partners</h2>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th><SortableTableHeader sort='name' filterOptions={filterOptions} >Name</SortableTableHeader></th>
                        <th><SortableTableHeader sort='country' filterOptions={filterOptions} >Country</SortableTableHeader></th>
                        <th><SortableTableHeader sort='type' filterOptions={filterOptions} >Type</SortableTableHeader></th>
                    </tr>
                </thead>
                <tbody>
                    {state.data._embedded.partners.map(
                        (partner: Partner, key: number) => (
                            <tr key={partner.id}>
                                <td><small className="text-muted">{key}</small></td>
                                <td><Link to={`/partner/${partner.slug}`}>{partner.organisation.name}</Link></td>
                                <td>{partner.organisation.country.country}</td>
                                <td>{partner.organisation.type.type}</td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>

        </React.Fragment>
    );
}

export default PartnerTable;