import React, {useEffect} from 'react';
import {UseAuth} from "context/user-context";
import {RouteComponentProps, useHistory} from "react-router-dom";

const LoadingComponent = () => <div> Waiting for login... </div>

export default function Callback(props: RouteComponentProps) {

    const auth = UseAuth();
    let history = useHistory();

    // Warning React Hook useEffect has a missing dependency: 'auth'. Either include it or remove the dependency array
    // but when i include it i get multiple oauth requests again... (@benjamin: confirmed.... i don't get it)
    useEffect(() => {

        //We switch to the URL search params API: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
        let params = new URLSearchParams(props.location.search);

        auth.setJwtToken(params.get('token'));

        //An extra roundtip is needed to get the user information
        auth.setUser('Johan van der Heide (to be updated)');

        if (auth.hasUser()) {
            history.replace('/');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.location.search, history]);

    return <LoadingComponent/>
}