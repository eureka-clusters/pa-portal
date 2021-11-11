import React from 'react';
import Config from "../../constants/config";
import {UseAuth} from "../../context/UserContext";
import {useHistory, useLocation} from "react-router-dom";

export default function Login() {

    const serverUri = Config.SERVER_URI;
    const CLIENT_ID = Config.CLIENT_ID;

    let history = useHistory();
    let location = useLocation();
    let auth = UseAuth();

    let from = location.state;

    auth.SaveRedirect();

    if (auth.user) {
        history.replace(auth.redirect);
    }

    // save the redirect
    // Warning: Cannot update a component (`ProvideAuth`) while rendering a different component (`Login`).
    // To locate the bad setState() call inside `Login`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render
    // caused by "setRedirect(from.pathname);"  it works if i Only save it in localstorage  and don't change the useState
    //auth.SaveRedirect();

    // manual saving doesn't throw the warning
    // the the from.pathname for redirect after login in the callback
    // if (from.pathname && from.pathname !== '/login' && from.pathname !== '/callback') {
    //     localStorage.setItem('redirect', from.pathname);
    //     console.log('redirect saved in localStorage', from.pathname);
    // }

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
                                                     href={serverUri + '/oauth2/login/via/itea.html?client_id=' + CLIENT_ID}>Login
                    via ITEA Office</a></div>
                <div className="p-2 bd-highlight"><a className="btn btn-primary btn-lg"
                                                     href={serverUri + '/oauth2/login/via/celtic.html?client_id=' + CLIENT_ID}>Login
                    via Celtic</a></div>
                <div className="p-2 bd-highlight"><a className="btn btn-primary btn-lg"
                                                     href={serverUri + '/oauth2/login/via/penta.html?client_id=' + CLIENT_ID}>Login
                    via Penta-Euripides</a></div>
            </div>
        </React.Fragment>
    );
}