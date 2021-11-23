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

        auth.LoginWithAuthorizationCode(params.get('code'), () => {

            console.log('auth in cb', auth);
            console.log('auth.state', auth.state);

            // console.log('callback after LoginWithAuthorizationCode', auth.redirect);
            if (auth.redirect !== undefined && auth.redirect !== null) {
                history.replace(auth.redirect);
            } else {
                history.replace('/');
            }

        }).then(() => {
            console.log('auth in then', auth);
            console.log('auth.state', auth.state);
            console.log('auth.state.errorMessage', auth.state.errorMessage);

            if (auth.state.errorMessage) {
                console.log('auth.state.errorMessage', auth.state.errorMessage);
                return (<h3 className="error"> {auth.state.errorMessage} </h3>);
            }
            return (<div> this is a test</div>);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.location.search, history]);


    if (auth.state.errorMessage) {
        throw new Error(auth.state.errorMessage);
    }

    return <LoadingComponent/>
}