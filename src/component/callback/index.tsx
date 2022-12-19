import {useContext, useEffect} from 'react';
import {AuthContext} from 'providers/auth-provider';
import {useSearchParams} from "react-router-dom";

const LoadingComponent = () => <div> Waiting for login... </div>

export default function Callback() {

    const authContext = useContext(AuthContext);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        let accessToken = '' + searchParams.get('access_token');
        let refreshToken = '' + searchParams.get('refresh_token');

        authContext.setAuthState(
            {
                accessToken: accessToken,
                refreshToken: refreshToken,
                authenticated: true
            }
        )


    }, [searchParams]);

    return <LoadingComponent/>
}