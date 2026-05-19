import axios from "axios";
import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

import {QueryState} from "@/component/partial/query-state";
import Config from "@/constants/config";
import {getServerUri} from "@/functions/get-server-uri";
import {Service} from "@/interface/service";
import {useAuth} from "@/providers/auth-provider";
import {useUser} from "@/providers/user-provider";

export default function Login() {
    const {isAuthenticated, isDevelopmentAuth, isDevelopmentAuthEnabled, loginWithDevelopmentToken, logout, token} = useAuth();
    const {loadUser, user} = useUser();
    const [developmentAuthError, setDevelopmentAuthError] = useState(false);

    useEffect(() => {
        if (!isDevelopmentAuthEnabled || user) {
            return;
        }

        let cancelled = false;

        const signInWithDevelopmentToken = async () => {
            const developmentToken = isDevelopmentAuth && token
                ? token
                : loginWithDevelopmentToken();

            if (!developmentToken) {
                if (!cancelled) {
                    setDevelopmentAuthError(true);
                }
                return;
            }

            try {
                await loadUser(developmentToken);

                if (!cancelled) {
                    setDevelopmentAuthError(false);
                }
            } catch {
                if (!cancelled) {
                    logout();
                    setDevelopmentAuthError(true);
                }
            }
        };

        void signInWithDevelopmentToken();

        return () => {
            cancelled = true;
        };
    }, [isDevelopmentAuth, isDevelopmentAuthEnabled, loadUser, loginWithDevelopmentToken, logout, token, user]);

    if (isDevelopmentAuthEnabled) {
        if (user) {
            return <Navigate to="/account" replace/>;
        }

        return (
            <QueryState
                isLoading={!developmentAuthError}
                isError={developmentAuthError}
                loadingMessage="Signing in with the development token..."
                errorMessage="The development token could not be used to sign in. Check VITE_DEV_AUTH_TOKEN in .env.local."
            />
        );
    }

    const servicesQuery = useQuery({
        queryKey: ["services"],
        enabled: !isDevelopmentAuthEnabled,
        queryFn: async () => {
            if (!Config.SERVICE_LIST_TOKEN) {
                throw new Error("Missing VITE_SERVICE_LIST_TOKEN");
            }

            const authorizationValue = Config.SERVICE_LIST_TOKEN.startsWith("Bearer ")
                ? Config.SERVICE_LIST_TOKEN
                : `Bearer ${Config.SERVICE_LIST_TOKEN}`;

            const response = await axios.get<{ _embedded: { items: Service[] } }>(`${getServerUri()}/api/list/service`, {
                headers: {
                    Authorization: authorizationValue,
                },
            });

            return response.data._embedded.items;
        },
    });

    if (isAuthenticated) {
        return <Navigate to="/account" replace/>;
    }

    if (servicesQuery.isLoading || servicesQuery.isError) {
        return (
            <QueryState
                isLoading={servicesQuery.isLoading}
                isError={servicesQuery.isError}
                errorMessage="The available login services could not be loaded. Check VITE_SERVICE_LIST_TOKEN in .env.local."
            />
        );
    }

    return (
        <>
            <div className="d-flex p-2 bd-highlight">
                <div className="jumbotron">
                    <h1 className="display-4">Welcome to Eureka Clusters Portal</h1>
                    <p>You can log in using your account in one of the cluster portals shown below.</p>
                </div>
            </div>
            <div className="d-flex flex-row bd-highlight mb-3">
                {servicesQuery.data?.map((service) => (
                    <a className="btn btn-lg bg-primary text-white mx-2" key={service.id} href={service.loginUrl}>
                        Login via {service.name}
                    </a>
                ))}
            </div>
        </>
    );
}
