import React, {createContext, useContext} from 'react';
import axios, {AxiosInstance} from 'axios';
import {AuthContext, AuthContextContent} from '@providers/auth-provider';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import {getServerUri} from "@functions/get-server-uri";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from "@constants/config";

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
                config.headers.Authorization = `Bearer ${authContext.getJwtToken()}`;
            }

            return config;
        },
        error => {
            return Promise.reject(error);
        },
    );

    const refreshAuthLogic = (failedRequest: any) => {
        const data = {};

        console.log('test');

        const options = {
            method: 'GET',
            data,
            url: getServerUri() + '/oauth2/renew?client_id=' + Config.CLIENT_ID,
        };

        return axios(options)
            .then(async tokenRefreshResponse => {
                failedRequest.response.config.headers.Authorization =
                    'Bearer ' + tokenRefreshResponse.data.jwtToken;

                authContext.setAuthState({
                    ...authContext.authState,
                    jwtToken: tokenRefreshResponse.data.jwtToken,
                });

                await AsyncStorage.setItem(
                    'token',
                    JSON.stringify({
                        jwtToken: tokenRefreshResponse.data.jwtToken,
                    }),
                );

                return Promise.resolve();
            })
            .catch(e => {
                authContext.setAuthState({
                    jwtToken: null,
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