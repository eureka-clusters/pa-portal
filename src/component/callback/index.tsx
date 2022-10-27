import {useEffect} from 'react';
import {useAuth} from "context/user-context";
import {useSearchParams} from "react-router-dom";

const LoadingComponent = () => <div> Waiting for login... </div>

export default function Callback() {

    const auth = useAuth();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        let token = '' + searchParams.get('token');

        auth.loginWithToken(token).then(() => {
            auth.redirectAfterLogin();
        });


    }, [searchParams]);

    if (auth.error) {
        return (
            <>Error {auth.error} </>
        );
    }
    return <LoadingComponent/>
}