import React from "react";
import Content from 'component/content';

import './App.scss';
import {AuthProvider} from "providers/auth-provider";
import {AxiosProvider} from "providers/axios-provider";
import {UserProvider} from "./providers/user-provider";


function App() {
    return (
        <AuthProvider>
            <AxiosProvider>
                <UserProvider>
                    <Content/>
                </UserProvider>
            </AxiosProvider>
        </AuthProvider>
    );
}

export default App;