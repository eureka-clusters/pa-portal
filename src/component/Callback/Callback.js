import React, {useEffect, useState } from 'react';
import { useAuth } from "../../context/UserContext";
import queryString from 'query-string';
import { useHistory } from "react-router-dom";

const LoadingComponent = () => <div> Waiting for login... </div>

export default function Callback(props) {

   
    const auth = useAuth();
    const [authorizationCode, setAuthorizationCode] = useState(null);
    let history = useHistory();

    /*
    const [authorizationCode, setAuthorizationCode] = useState(null);

    useEffect(() => {
        auth.loginWithAuthorizationCode(authorizationCode, () => {
            //console.log('callback after authorize');
            
            // I can't use the hook to redirect
            // Uncaught (in promise) Error: Invalid hook call. Hooks can only be called inside of the body of a function component
            //auth.RedirectAfterLogin();

            // console.log('callback after authorize', auth.redirect);
            history.replace(auth.redirect);
        });
    }, [authorizationCode]);
    // Warning: React Hook useEffect has missing dependencies: 'auth' and 'history'. Either include them or remove the dependency array  react-hooks/exhaustive-deps
    // if i include them the oauth call is again called multiple times.
    //}, [authorizationCode, auth, history]);

    let params = queryString.parse(props.location.search);
    if (params.code) {
        if (authorizationCode !== params.code) {
            //console.log('setAuthorizationCode code changed', params.code);
            setAuthorizationCode(params.code);
        } else {
            //console.log('setAuthorizationCode code not changed', params.code);
        }
    }
    */

    // Warning React Hook useEffect has a missing dependency: 'auth'. Either include it or remove the dependency array
    // but when i include it i get multiple oauth requests again...
    useEffect(() => {
        let params = queryString.parse(props.location.search);
        auth.loginWithAuthorizationCode(params.code, () => {
            // console.log('callback after loginWithAuthorizationCode', auth.redirect);
            history.replace(auth.redirect);
        });
    }, [props.location.search, history]);


    // perhaps don't use useEffect for checking the authorization code checking?
    // => 2x outh call 
    // let params = queryString.parse(props.location.search);
    // if (params.code) {
    //     if (authorizationCode !== params.code) {
    //         console.log('setAuthorizationCode code changed', params.code);
    //         setAuthorizationCode(params.code);

    //         if (!auth.user) {
    //             auth.loginWithAuthorizationCode(params.code, () => {
    //                 // console.log('callback after loginWithAuthorizationCode', auth.redirect);
    //                 history.replace(auth.redirect);
    //             });
    //         }
    //     } else {
    //         console.log('setAuthorizationCode code not changed', params.code);
    //     }
    // }
    return <LoadingComponent />
}