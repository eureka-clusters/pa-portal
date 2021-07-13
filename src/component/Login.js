import React from 'react';

export default function Login(props) {

    return (
        <div className="container">
            <div className="jumbotron">
                <h1 className="display-4">Welcome to Eureka Clusters Backend</h1>
            </div>

            <a className="btn btn-primary btn-lg" href="https://dev.backend.eureka-clusters.eu/oauth2/login/via/itea.html">Login via ITEA Office</a>
            <a className="btn btn-primary btn-lg" href="https://dev.backend.eureka-clusters.eu/oauth2/login/via/celtic.html">Login via Celtic</a>
            <a className="btn btn-primary btn-lg" href="https://dev.backend.eureka-clusters.eu/oauth2/login/via/penta.html">Login via Penta-Euripides</a>
        </div>
    );
}