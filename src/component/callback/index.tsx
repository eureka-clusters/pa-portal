import React, {useEffect } from 'react';
import { useAuth } from "../../context/UserContext";
import { useHistory } from "react-router-dom";
import {RouteComponentProps} from "react-router-dom";
import queryString from "querystring"; //Typescript wants to use the querystring instead of query-string...

const LoadingComponent = () => <div> Waiting for login... </div>

export default function Callback(props:RouteComponentProps) {
  
    const auth = useAuth();
    let history = useHistory();

    /*
    const [authorizationCode, setAuthorizationCode] = useState(null);

    useEffect(() => {
        auth.LoginWithAuthorizationCode(authorizationCode, () => {
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
    // but when i include it i get multiple oauth requests again... (@benjamin: confirmed.... i don't get it)
    useEffect(() => {
        let params = queryString.parse(props.location.search);
        auth.LoginWithAuthorizationCode(params.code, () => {

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
    
            if(auth.state.errorMessage) {
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

    return <LoadingComponent />
}