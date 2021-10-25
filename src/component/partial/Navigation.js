import React, { useContext } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import Switch from "react-bootstrap/Switch";
import Statistics from "../Statistics/Statistics";
import Project from "../Projects/Project";
import Login from "../Login";
import Logout from "../Logout";
import Callback from "../Callback";
import Partner from "../Partners/Partner";

export default function Navigation() {
    const { hasUser } = useContext(UserContext);

    if (!hasUser) {
        return (<BrowserRouter>
            <header>
                <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                    <div className="container">
                        <a className="navbar-brand" href="/">PA Report Portal</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">Login</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="flex-shrink-0">
                <div className="container">
                    <Switch>
                        <Route path='/login'
                            render={props => <Login {...props} />}
                        />
                        <Route path='/callback'
                            render={props => <Callback {...props} />}
                        />
                    </Switch>
                </div>
            </main>
            <footer className="footer mt-auto py-3 bg-light">
                <div className="container">
                    <span className="text-muted">Copyright ITEA & Celtic-Next</span>
                </div>
            </footer>
        </BrowserRouter>);
    }

    return (<BrowserRouter>
        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                <div className="container">
                    <a className="navbar-brand" href="/">PA Report Portal</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/statistics" className="nav-link active" aria-current="page">Statistics</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/projects" className="nav-link">Project</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/partners" className="nav-link">Partners</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/logout" className="nav-link">Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
        <main className="flex-shrink-0">
            <div className="container">
                <Switch>
                    <Route path='/logout'
                        render={props => <Logout {...props} />}
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
        <footer className="footer mt-auto py-3 bg-light">
            <div className="container">
                <span className="text-muted">Copyright ITEA & Celtic-Next</span>
            </div>
        </footer>
    </BrowserRouter>);
}