import React, {useContext, useEffect, useState} from 'react';

import {useLocation} from "react-router-dom";
import axios from "axios";
import {Service} from "@/interface/service";
import {getServerUri} from "@/functions/get-server-uri";
import {AuthContext} from "@/providers/auth-provider";

export default function Login() {

    const [services, setServices] = useState<Array<Service>>([]);
    const [error, setError] = useState<string | null>(null);

    let location = useLocation();
    let {from} = location.state || {from: {pathname: "/"}};


    useEffect(() => {

        const abortController = new AbortController();

        axios.get<{ _embedded: { items: Service[] } }>(
            getServerUri() + '/api/list/service', {
                signal: abortController.signal
            }
        ).then((response) => {
            const {data} = response
            setServices(data._embedded.items);
        }).catch((error) => {
            setError(error.message);
        });

        return () => {
            abortController.abort();
        }
    }, []);

    return (
        <React.Fragment>
            <div className="d-flex p-2 bd-highlight">
                <div className="jumbotron">
                    <h1 className="display-4">Welcome to Eureka Clusters Portal</h1>
                    <p>You must log in to view the page at {from.pathname}</p>
                </div>
            </div>
            <div className="d-flex flex-row bd-highlight mb-3">
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {services.map((service) => (
                        <a className="btn btn-lg bg-primary text-white" key={service.id} href={service.loginUrl}>Login
                            via {service.name}</a>
                    )
                )}
            </div>
        </React.Fragment>
    );
}