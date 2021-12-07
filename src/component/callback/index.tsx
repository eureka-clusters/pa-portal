import {useEffect} from 'react';
import { useAuth} from "context/user-context";
import {RouteComponentProps, useHistory} from "react-router-dom";

const LoadingComponent = () => <div> Waiting for login... </div>

export default function Callback(props: RouteComponentProps) {

    const auth = useAuth();
    let history = useHistory();

    // Warning React Hook useEffect has a missing dependency: 'auth'. Either include it or remove the dependency array
    // but when i include it i get multiple oauth requests again... (@benjamin: confirmed.... i don't get it)
    // useEffect(() => {
    //     //We switch to the URL search params API: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    //     let params = new URLSearchParams(props.location.search);
    //     auth.setJwtToken(params.get('token'));

    //     //An extra roundtip is needed to get the user information
    //     auth.setUser('Johan van der Heide (to be updated)');

    //     if (auth.hasUser()) {
    //         history.replace('/');
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [props.location.search, history]);

    useEffect(() => {
        let params = new URLSearchParams(props.location.search);
        const loginWithToken = async (params: any) => {
            await auth.loginWithToken(params.get('token'), () => {
                console.log('cb after loginWithToken');
            })
            auth.redirectAfterLogin();
        }
        loginWithToken(params)
        // console.log('after loginWithToken doesn\t wait for the exec');
    }, [props.location.search, history]);  // auth couldn't be added into the useEffect otherwise it will be 2 renders.

    return <LoadingComponent/>
}