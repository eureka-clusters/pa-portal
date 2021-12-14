import React from 'react';
import Config from "constants/config";
import { useAuth } from "context/user-context";
import { useLocation } from "react-router-dom";

// import { useHistory, useLocation } from "react-router-dom";
// import { Redirect } from 'react-router';

interface iLocation {
    from: { pathname: string }
}


export default function Login() {

    const serverUri = Config.SERVER_URI;
    const clientId = Config.CLIENT_ID;

    // let history = useHistory();
    let location = useLocation<iLocation>();
    let auth = useAuth();
    let { from } = location.state || { from: { pathname: "/" } };

    // save redirect for not logged in users
    auth.saveRedirect(from);

    // if user already logged in redirect him
    if (auth.hasUser()) {
        auth.redirectAfterLogin();
        // history.replace(auth.redirect);
        // return <Redirect to={auth.redirect} />
    }



    return (
        <React.Fragment>
            <div className="d-flex p-2 bd-highlight">
                <div className="jumbotron">
                    <h1 className="display-4">Welcome to Eureka Clusters Backend</h1>
                    <p>You must log in to view the page at {from.pathname}</p>
                </div>
            </div>
            <div className="d-flex flex-row bd-highlight mb-3">
                <div className="p-2 bd-highlight"><a className="btn btn-primary btn-lg"
                                                     href={serverUri + '/oauth2/login/via/itea.html?client=' + clientId}>Login
                    via ITEA Office</a></div>
                <div className="p-2 bd-highlight"><a className="btn btn-primary btn-lg"
                                                     href={serverUri + '/oauth2/login/via/celtic.html?client=' + clientId}>Login
                    via Celtic</a></div>
                <div className="p-2 bd-highlight"><a className="btn btn-primary btn-lg"
                                                     href={serverUri + '/oauth2/login/via/penta.html?client=' + clientId}>Login
                    via Penta-Euripides</a></div>
            </div>
        </React.Fragment>
    );
}