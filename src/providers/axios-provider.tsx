import React, {createContext, useContext} from 'react';
import axios, {AxiosInstance} from 'axios';
import {AuthContext, AuthContextContent} from 'providers/auth-provider';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import {getServerUri} from "functions/get-server-uri";

const AxiosContext = createContext<AxiosContextContent>({} as AxiosContextContent);
const {Provider} = AxiosContext;

interface AxiosContextContent {
    authAxios: AxiosInstance,
}

const AxiosProvider = ({children}: { children: any }) => {
    const authContext = useContext<AuthContextContent>(AuthContext);

    const authAxios = axios.create({
        baseURL: getServerUri() + '/api',
    });

    authAxios.interceptors.request.use(
        (config: any) => {
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${authContext.authState.accessToken}`;
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
        const data = {};

        const options = {
            method: 'GET',
            data,
            url: getServerUri() + '/oauth/refresh',
        };

        return axios(options)
            .then(async tokenRefreshResponse => {
                failedRequest.response.config.headers.Authorization =
                    'Bearer ' + tokenRefreshResponse.data.accessToken;

                authContext.setAuthState({
                    ...authContext.authState,
                    accessToken: tokenRefreshResponse.data.accessToken,
                    refreshToken: tokenRefreshResponse.data.refreshToken,
                });

                await localStorage.setItem(
                    'token',
                    JSON.stringify({
                        accessToken: tokenRefreshResponse.data.accessToken,
                        refreshToken: tokenRefreshResponse.data.refreshToken,
                    }),
                );

                return Promise.resolve();
            })
            .catch(e => {
                authContext.setAuthState({
                    accessToken: null,
                    refreshToken: null,
                    authenticated: false
                });
            });
    };

    createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});

    return (
        <Provider
            value={{authAxios}}>
            {children}
        </Provider>
    );
};

export {AxiosContext, AxiosProvider};