import React, { createContext, useContext } from 'react';
import axios, { AxiosInstance } from 'axios';
import { AuthContext, AuthContextContent } from '@/providers/auth-provider';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { getServerUri } from "@/functions/get-server-uri";

const AxiosContext = createContext<AxiosContextContent>({} as AxiosContextContent);
const { Provider } = AxiosContext;

interface AxiosContextContent {
    authAxios: AxiosInstance,
}

const AxiosProvider = ({ children }: { children: any }) => {
    const authContext = useContext<AuthContextContent>(AuthContext);

    const authAxios = axios.create({
        baseURL: getServerUri() + '/api',
    });

    authAxios.interceptors.request.use(
        (config: any) => {
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${authContext.getToken()}`;
            }

            axios.defaults.headers.common["Accept"] = 'application/json';
            axios.defaults.headers.common["Content-Type"] = 'application/json';

            return config;
        },
        error => {
            return Promise.reject(error);
        },
    );

    const refreshAuthLogic = (failedRequest: any) => {
        const data = {
            clientId: authContext.getClientId(),
            token: authContext.getToken(),
        };

        const options = {
            method: 'GET',
            data,
            url: getServerUri() + '/oauth2/refresh.html',
        };

        return axios(options)
            .then(async tokenRefreshResponse => {
                failedRequest.response.config.headers.Authorization =
                    'Bearer ' + tokenRefreshResponse.data.accessToken;

                authContext.saveAuthState({
                    ...authContext.getAuthState(),
                    jwtToken: tokenRefreshResponse.data.token,
                });

                return Promise.resolve();
            })
            .catch(e => {
                authContext.saveAuthState({
                    jwtToken: null,
                    clientId: null,
                    authenticated: false
                });
            });
    };

    createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});

    return (
        <Provider
            value={{ authAxios }}>
            {children}
        </Provider>
    );
};

export { AxiosContext, AxiosProvider };