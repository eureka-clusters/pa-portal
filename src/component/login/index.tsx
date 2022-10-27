import React, {useEffect, useState} from 'react';
import {useAuth} from "context/user-context";
import {useLocation} from "react-router-dom";
import axios from "axios";
import {Service} from "interface/service";
import {getServerUri} from "function/get-server-uri";

export default function Login() {

    const [services, setServices] = useState<Array<Service>>([]);
    let location = useLocation();
    let auth = useAuth();
    let {from} = location.state || {from: {pathname: "/"}};

    // if user already logged in redirect him or her
    if (auth.hasUser()) {
        auth.redirectAfterLogin();
    }

    useEffect(() => {
        const fetchData = async () => {
            await axios.get<{ _embedded: { services: Service[] } }>(
                getServerUri() + '/api/list/service'
            ).then((response) => {
                const {data} = response
                setServices(data._embedded.services);
            });


        };

        fetchData();
    }, []);

    return (
        <React.Fragment>
            <div className="d-flex p-2 bd-highlight">
                <div className="jumbotron">
                    <h1 className="display-4">Welcome to Eureka Clusters Backend</h1>
                    <p>You must log in to view the page at {from.pathname}</p>
                </div>
            </div>
            <div className="d-flex flex-row bd-highlight mb-3">

                {services.map((service) => (
                        <a className="btn btn-lg bg-primary text-white" key={service.id} href={service.loginUrl}>Login
                            via {service.name}</a>
                    )
                )}
            </div>
        </React.Fragment>
    );
}