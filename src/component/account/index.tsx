import React from 'react';
import { Me } from "component/partial/Me";
// import { Me2 } from "component/partial/Me2";
import { useAuth } from "context/user-context";

export default function Account() {

    let auth = useAuth();

    return <>
        <h2>auth</h2>
        <span>
            user : <pre className='debug'>{JSON.stringify(auth.user, undefined, 2)}</pre><br />
            userInfo : <pre className='debug'>{JSON.stringify(auth.userInfo, undefined, 2)}</pre><br />
        </span>
        <h2>ME Component</h2>
        <Me />
        {/* <h2>ME2 Component</h2>
        <Me2 /> */}
     </>;
}