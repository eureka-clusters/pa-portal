import React from 'react'
import ReactDOM from 'react-dom/client'
import {AuthProvider} from "@/providers/auth-provider";
import {AxiosProvider} from "@/providers/axios-provider";
import {UserProvider} from "@/providers/user-provider";
import Content from "@/component/content";

import './App.scss';
import {BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <AxiosProvider>
                    <UserProvider>
                        <Content/>
                    </UserProvider>
                </AxiosProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
