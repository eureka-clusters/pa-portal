import React from 'react';
import ReactDOM from 'react-dom';
import { UserContextProvider } from "./context/UserContext";

import './App.scss';
import Navigation from './component/partial/Navigation';

const domContainer = document.getElementById('root');

ReactDOM.render(
    <React.StrictMode>
        <UserContextProvider>
                <Navigation />
        </UserContextProvider>
    </React.StrictMode>,
    domContainer
);