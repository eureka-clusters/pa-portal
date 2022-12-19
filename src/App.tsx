import React from "react";
import Content from 'component/content';

import './App.scss';
import {AuthProvider} from "providers/auth-provider";
import {AxiosProvider} from "providers/axios-provider";


function App() {
    return (
        <AuthProvider>
            <AxiosProvider>
                <Content/>
            </AxiosProvider>
        </AuthProvider>
    );
}

export default App;