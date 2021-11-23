import React from 'react';
import Config from "constants/config";
import {UseAuth} from "context/user-context";
import {useHistory} from "react-router-dom";

export default function Login() {

    const serverUri = Config.SERVER_URI;

    let history = useHistory();
    let auth = UseAuth();

    auth.SaveRedirect();

    if (auth.user) {
        history.replace(auth.redirect);
    }

    return (
        <React.Fragment>
            <div className="d-flex p-2 bd-highlight">
                <div className="jumbotron">
                    <h1 className="display-4">Welcome to Eureka Clusters Backend</h1>
                    {/*<p>You must log in to view the page at {from}</p>*/}
                </div>
            </div>
            <div className="d-flex flex-row bd-highlight mb-3">
                <div className="p-2 bd-highlight"><a className="btn btn-primary btn-lg"
                                                     href={serverUri + '/oauth2/login/via/itea.html'}>Login
                    via ITEA Office</a></div>
                <div className="p-2 bd-highlight"><a className="btn btn-primary btn-lg"
                                                     href={serverUri + '/oauth2/login/via/celtic.html'}>Login
                    via Celtic</a></div>
                <div className="p-2 bd-highlight"><a className="btn btn-primary btn-lg"
                                                     href={serverUri + '/oauth2/login/via/penta.html'}>Login
                    via Penta-Euripides</a></div>
            </div>
        </React.Fragment>
    );
}