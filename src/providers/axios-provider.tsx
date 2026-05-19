import {createContext, ReactNode, useContext, useEffect, useMemo, useRef} from "react";
import axios, {AxiosInstance, InternalAxiosRequestConfig} from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

import {getServerUri} from "@/functions/get-server-uri";
import {useAuth} from "@/providers/auth-provider";

interface AxiosContextContent {
    authAxios: AxiosInstance;
}

const AxiosContext = createContext<AxiosContextContent | undefined>(undefined);

const AxiosProvider = ({children}: { children: ReactNode }) => {
    const {authState, clientId, isDevelopmentAuth, logout, saveAuthState, token} = useAuth();
    const authStateRef = useRef(authState);

    const authAxios = useMemo(() => axios.create({
        baseURL: `${getServerUri()}/api`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    }), []);

    useEffect(() => {
        authStateRef.current = authState;
    }, [authState]);

    useEffect(() => {
        const requestInterceptor = authAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            if (!config.headers.Authorization && token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });

        if (isDevelopmentAuth) {
            return () => {
                authAxios.interceptors.request.eject(requestInterceptor);
            };
        }

        const refreshInterceptor = createAuthRefreshInterceptor(authAxios, async (failedRequest) => {
            if (!clientId || !token) {
                logout();
                throw new Error("Cannot refresh the session without a token and client id");
            }

            const response = await axios.post<{ accessToken?: string; token?: string }>(
                `${getServerUri()}/oauth2/refresh.html`,
                {
                    client_id: clientId,
                    token,
                },
            );

            const refreshedToken = response.data.token ?? response.data.accessToken;

            if (!refreshedToken) {
                logout();
                throw new Error("The refresh endpoint did not return a token");
            }

            failedRequest.response.config.headers = {
                ...failedRequest.response.config.headers,
                Authorization: `Bearer ${refreshedToken}`,
            };

            saveAuthState({
                ...authStateRef.current,
                jwtToken: refreshedToken,
                authenticated: true,
            });
        });

        return () => {
            authAxios.interceptors.request.eject(requestInterceptor);
            authAxios.interceptors.response.eject(refreshInterceptor);
        };
    }, [authAxios, clientId, isDevelopmentAuth, logout, saveAuthState, token]);

    const value = useMemo(() => ({authAxios}), [authAxios]);

    return (
        <AxiosContext.Provider value={value}>
            {children}
        </AxiosContext.Provider>
    );
};

function useAxios() {
    const context = useContext(AxiosContext);

    if (!context) {
        throw new Error("useAxios must be used within an AxiosProvider");
    }

    return context;
}

export {AxiosContext, AxiosProvider, useAxios};
