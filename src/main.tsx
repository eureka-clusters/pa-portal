import React from 'react'
import ReactDOM from 'react-dom/client'
import {AuthProvider} from "@/providers/auth-provider";
import {AxiosProvider} from "@/providers/axios-provider";
import {UserProvider} from "@/providers/user-provider";
import Content from "@/component/content";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {BrowserRouter} from "react-router-dom";
import './App.scss';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
        },
    },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <AxiosProvider>
                    <QueryClientProvider client={queryClient}>
                        <UserProvider>
                            <Content/>
                            {/*<ReactQueryDevtools/>*/}
                        </UserProvider>
                    </QueryClientProvider>
                </AxiosProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
