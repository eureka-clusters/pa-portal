import React from 'react';
import ReactDOM from 'react-dom';
import {UserContextProvider} from "./context/UserContext";
import Statistics from "./component/Statistics";
import {BrowserRouter, Route} from 'react-router-dom';
import Switch from "react-bootstrap/Switch";
import Project from "./component/Project";
import Partner from "./component/Partner";

const domContainer = document.getElementById('root');

ReactDOM.render(
    <React.StrictMode>
        <UserContextProvider>
            <BrowserRouter>
                <Switch>
                    <Route path='/'
                           render={props => <Statistics {...props} />}
                    />
                    <Route path='/project/:project'
                           render={props => <Project {...props} />}
                    />
                    <Route path='/partner/:id'
                           render={props => <Partner {...props} />}
                    />
                </Switch>
            </BrowserRouter>
        </UserContextProvider>
    </React.StrictMode>,
    domContainer
);