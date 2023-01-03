import {useContext} from "react";
import {UserContext} from "@/providers/user-provider";

export default function Account() {

    let userContext = useContext(UserContext);

    const userInfo = userContext.getUser();

    return <>
        <h1>Account</h1>

        <dl className="row">
            <dt className="col-sm-3 text-end">Email:</dt>
            <dd className="col-sm-9">{userInfo.email}</dd>
            <dt className="col-sm-3 text-end">Name:</dt>
            <dd className="col-sm-9">{userInfo.first_name} {userInfo.last_name}</dd>
            <dt className="col-sm-3 text-end">Is Funder:</dt>
            <dd className="col-sm-9">{userInfo.is_funder ? 'Yes' : 'No'}</dd>
            <dt className="col-sm-3 text-end">Is ESE Staff:</dt>
            <dd className="col-sm-9">{userInfo.is_eureka_secretariat_staff_member ? 'Yes' : 'No'}</dd>
            <dt className="col-sm-3 text-end">Funder Country:</dt>
            <dd className="col-sm-9">{userInfo.funder_country}</dd>
            {userInfo.funder_clusters && userInfo.funder_clusters.length > 0 ? (
                <>
                    <dt className="col-sm-3 text-end">Funder Clusters:</dt>
                    <dd className="col-sm-9">
                        {userInfo.funder_clusters && userInfo.funder_clusters.map((cluster: string, i: number) => (
                            <span key={i}>{cluster}<br/></span>
                        ))}

                    </dd>
                </>
            ) : null}
        </dl>
    </>;
}