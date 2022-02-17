import React from 'react';
import { useAuth } from "context/user-context";
// tests
import { Me } from "component/partial/Me";
import { Me2 } from "component/partial/Me2";

export default function Account() {

    let auth = useAuth();

    return <>
        <h1>Account</h1>
     
        <dl className="row">
            <dt className="col-sm-3 text-end">Email:</dt>
            <dd className="col-sm-9">{auth.userInfo.email}</dd>
            <dt className="col-sm-3 text-end">Name:</dt>
            <dd className="col-sm-9">{auth.userInfo.first_name} {auth.userInfo.last_name}</dd>
            <dt className="col-sm-3 text-end">Is Funder:</dt>
            <dd className="col-sm-9">{auth.userInfo.is_funder ? 'true': 'false'}</dd>
            <dt className="col-sm-3 text-end">Funder Country:</dt>
            <dd className="col-sm-9">{auth.userInfo.funder_country}</dd>
            {auth.userInfo.funder_clusters ? (
                <>
                <dt className="col-sm-3 text-end">Funder Clusters:</dt>
                <dd className="col-sm-9">
                    <ul>
                    {auth.userInfo.funder_clusters && auth.userInfo.funder_clusters.map((cluster: string, i: number) => (
                        <li key={i}>{cluster}</li>
                    ))}
                    </ul>
                </dd>
                </>
            ) : null}
        </dl>
             
        <h2>debug:</h2> 
        <span>
            auth.user : <pre className='debug'>{JSON.stringify(auth.user, undefined, 2)}</pre><br />
            auth.userInfo : <pre className='debug'>{JSON.stringify(auth.userInfo, undefined, 2)}</pre><br />
        </span>


        <h2>ME Component</h2>
        <Me />
        <h2>ME2 Component</h2>
        <Me2 />
     </>;
}