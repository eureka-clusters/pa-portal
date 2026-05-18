import {useEffect, useState} from "react";
import {Navigate, useSearchParams} from "react-router-dom";

import {useAuth} from "@/providers/auth-provider";
import {useUser} from "@/providers/user-provider";

export default function Callback() {
    const [searchParams] = useSearchParams();
    const {isAuthenticated, saveAuthState} = useAuth();
    const {loadUser, user} = useUser();
    const [isComplete, setIsComplete] = useState(false);
    const [hasError, setHasError] = useState(false);

    const token = searchParams.get("token");
    const clientId = searchParams.get("client_id");

    useEffect(() => {
        if (!token || !clientId) {
            setHasError(true);
            return;
        }

        let cancelled = false;

        const completeLogin = async () => {
            try {
                saveAuthState({
                    jwtToken: token,
                    clientId,
                    authenticated: true,
                });

                await loadUser(token);

                if (!cancelled) {
                    setIsComplete(true);
                }
            } catch {
                if (!cancelled) {
                    setHasError(true);
                }
            }
        };

        void completeLogin();

        return () => {
            cancelled = true;
        };
    }, [clientId, loadUser, saveAuthState, token]);

    if (hasError) {
        return <div>Unable to complete sign in.</div>;
    }

    if (isAuthenticated && (isComplete || user)) {
        return <Navigate to="/account" replace/>;
    }

    return <div>Waiting for login...</div>;
}
