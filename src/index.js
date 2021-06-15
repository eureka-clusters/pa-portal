import React from 'react';
import ReactDOM from 'react-dom';
import { UserContextProvider } from "./context/UserContext";
import Statistics from "./component/Statistics";
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Switch from "react-bootstrap/Switch";
import Project from "./component/Project";
import Login from "./component/Login";
import Partner from "./component/Partner";
import './App.scss';

const domContainer = document.getElementById('root');

ReactDOM.render(
    <React.StrictMode>
        <UserContextProvider>
            <BrowserRouter>
                <header>
                    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                        <div class="container">
                            <a class="navbar-brand" href="#">PA Report Portal</a>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li class="nav-item">
                                        <Link to="/statistics" class="nav-link active" aria-current="page">Statistics</Link>
                                    </li>
                                    <li class="nav-item">
                                        <Link to="/projects" class="nav-link">Project</Link>
                                    </li>
                                    <li class="nav-item">
                                        <Link to="/partners" class="nav-link">Partners</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </header>
                <main class="flex-shrink-0">
                    <div class="container">
                        <Switch>
                            <Route path='/login'
                                render={props => <Login {...props} />}
                            />
                            <Route path='/statistics'
                                render={props => <Statistics {...props} />}
                            />
                            <Route path='/projects'
                                render={props => <Project {...props} />}
                            />
                            <Route path='/partners'
                                render={props => <Partner {...props} />}
                            />
                        </Switch>
                    </div>
                </main>
                <footer class="footer mt-auto py-3 bg-light">
                    <div class="container">
                        <span class="text-muted">Copyright ITEA & Celtic-Next</span>
                    </div>
                </footer>
            </BrowserRouter>
        </UserContextProvider>
    </React.StrictMode>,
    domContainer
);