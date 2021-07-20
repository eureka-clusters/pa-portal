import { useContext, useEffect, useState } from 'react';
import { UserContext } from "../context/UserContext";
import { Redirect } from 'react-router';
import GetAccessToken from '../function/GetAccessToken';
import queryString from 'query-string';


const LoadingComponent = () => <div> Waiting for login... </div>

export default function Callback(props) {

    const { setBearerToken } = useContext(UserContext);
    const { accessToken } = useContext(UserContext);
    const [authorizationCode, setAuthorizationCode] = useState(null);
    const [state, setState] = useState({ notLoaded: true });

    useEffect(() => {
        GetAccessToken(authorizationCode).then(bearerToken => {
            setBearerToken(bearerToken);

            // not sure which is correct both are working
            //setState(true);
            setState({notLoaded: false});
        });
    }, [authorizationCode]);

    // get the authorizationCode from the queryString
    let params = queryString.parse(props.location.search);
    if (params.code) {
        if (authorizationCode != params.code) {
            console.log('setAuthorizationCode code changed', params.code);
            setAuthorizationCode(params.code);
        } else {
            console.log('setAuthorizationCode code not changed', params.code);
        }
    }

    // doesn't work
    // if (!accessToken) { // doesn't work?
    //     console.log('accessToken', accessToken);
    //     return <LoadingComponent /> // -or- return <div/>
    // }

    // doesn't work?
    // if (accessToken === null) { 
    //     console.log('accessToken', accessToken);
    //     return <LoadingComponent /> // -or- return <div/>
    // }

    
    if (state.notLoaded) {
        console.log('state', state);
        //return some loading component(s) or (nothing to avoid flicker)
        return <LoadingComponent /> // -or- return <div/>
        //return <div />
    }
    console.log('state', state);
    return <Redirect to='/statistics' />
}