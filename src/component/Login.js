import React from 'react';
import Config from "../constants/Config";

export default function Login(props) {

    const serverUri = Config.SERVER_URI;

    return (
        <div className="container">
            <div className="jumbotron">
                <h1 className="display-4">Welcome to Eureka Clusters Backend</h1>
            </div>
            <a className="btn btn-primary btn-lg" href={serverUri+'/oauth2/login/via/itea.html'}>Login via ITEA Office</a>
            <a className="btn btn-primary btn-lg" href={serverUri+'/oauth2/login/via/celtic.html'}>Login via Celtic</a>
            <a className="btn btn-primary btn-lg" href={serverUri+'/oauth2/login/via/penta.html'}>Login via Penta-Euripides</a>
        </div>
    );
}