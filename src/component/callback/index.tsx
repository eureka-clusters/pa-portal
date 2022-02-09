import {useEffect} from 'react';
import { useAuth} from "context/user-context";
import {RouteComponentProps, useHistory} from "react-router-dom";

const LoadingComponent = () => <div> Waiting for login... </div>

export default function Callback(props: RouteComponentProps) {

    const auth = useAuth();
    let history = useHistory();

    // Warning React Hook useEffect has a missing dependency: 'auth'. Either include it or remove the dependency array
    // but when i include it i get multiple oauth requests again... (@benjamin: confirmed.... i don't get it)
    useEffect(() => {
        let params = new URLSearchParams(props.location.search);
        const loginWithToken = async (params: any) => {
            if( await auth.loginWithToken(params.get('token'), () => {
                // console.log('cb after loginWithToken');
                // cb not yet needed but good for test if the async code works correctly
            })) {
                auth.redirectAfterLogin();
            } 
        }
        loginWithToken(params);
        // console.log('after loginWithToken doesn\t wait for the exec');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.location.search, history]); 

    if (auth.error) {
        return (
            <>Error {auth.error} </>
        );
    }
    return <LoadingComponent/>
}