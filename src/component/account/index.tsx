import {useContext} from "react";
import {AuthContext} from "providers/auth-provider";

export default function Account() {

    let authContext = useContext(AuthContext);

    const userInfo = authContext.getUser();

    return <>
        <h1>Account</h1>

        <dl className="row">
            <dt className="col-sm-3 text-end">Email:</dt>
            <dd className="col-sm-9">{userInfo.email}</dd>
            <dt className="col-sm-3 text-end">Name:</dt>
            <dd className="col-sm-9">{userInfo.first_name} {userInfo.last_name}</dd>
            <dt className="col-sm-3 text-end">Is Funder:</dt>
            <dd className="col-sm-9">{userInfo.is_funder ? 'true' : 'false'}</dd>
            <dt className="col-sm-3 text-end">Funder Country:</dt>
            <dd className="col-sm-9">{userInfo.funder_country}</dd>
            {userInfo.funder_clusters ? (
                <>
                    <dt className="col-sm-3 text-end">Funder Clusters:</dt>
                    <dd className="col-sm-9">
                        <ul>
                            {userInfo.funder_clusters && userInfo.funder_clusters.map((cluster: string, i: number) => (
                                <li key={i}>{cluster}</li>
                            ))}
                        </ul>
                    </dd>
                </>
            ) : null}
        </dl>
    </>;
}