import {useContext, useEffect} from 'react';
import {AuthContext} from '@/providers/auth-provider';
import {Navigate, useSearchParams} from "react-router-dom";
import {UserContext} from "@/providers/user-provider";


const LoadingComponent = () => <div> Waiting for login... </div>

export default function Callback() {

    const authContext = useContext(AuthContext);
    const userContext = useContext(UserContext);

    const [searchParams] = useSearchParams();

    useEffect(() => {

        let token = '' + searchParams.get('token');
        let clientId = '' + searchParams.get('client_id');

        authContext.saveAuthState(
            {
                jwtToken: token,
                clientId: clientId,
                authenticated: true
            }
        )

        userContext.loadUser(token);


    }, [searchParams]);

    if (authContext.isAuthenticated()) {
        return <Navigate to={'/account'}/>
    }

    return <LoadingComponent/>
}