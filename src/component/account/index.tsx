import {useAuth} from "context/user-context";

export default function Account() {

    let auth = useAuth();

    return <>
        <h1>Account</h1>

        <dl className="row">
            <dt className="col-sm-3 text-end">Email:</dt>
            <dd className="col-sm-9">{auth.UserInfo.email}</dd>
            <dt className="col-sm-3 text-end">Name:</dt>
            <dd className="col-sm-9">{auth.UserInfo.first_name} {auth.UserInfo.last_name}</dd>
            <dt className="col-sm-3 text-end">Is Funder:</dt>
            <dd className="col-sm-9">{auth.UserInfo.is_funder ? 'true' : 'false'}</dd>
            <dt className="col-sm-3 text-end">Funder Country:</dt>
            <dd className="col-sm-9">{auth.UserInfo.funder_country}</dd>
            {auth.UserInfo.funder_clusters ? (
                <>
                    <dt className="col-sm-3 text-end">Funder Clusters:</dt>
                    <dd className="col-sm-9">
                        <ul>
                            {auth.UserInfo.funder_clusters && auth.UserInfo.funder_clusters.map((cluster: string, i: number) => (
                                <li key={i}>{cluster}</li>
                            ))}
                        </ul>
                    </dd>
                </>
            ) : null}
        </dl>
    </>;
}