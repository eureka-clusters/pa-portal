import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Service} from "@/interface/service";
import {getServerUri} from "@/functions/get-server-uri";

export default function Login() {

    const [services, setServices] = useState<Array<Service>>([]);

    useEffect(() => {

        const abortController = new AbortController();

        axios.get<{ _embedded: { items: Service[] } }>(
            getServerUri() + '/api/list/service', {
                signal: abortController.signal
            }
        ).then((response) => {
            const {data} = response
            setServices(data._embedded.items);
        }).catch(() => {

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
                    <p>You can log in using your account in one of the Cluster Portals show below</p>
                </div>
            </div>
            <div className="d-flex flex-row bd-highlight mb-3">
                {services.map((service) => (
                        <a className="btn btn-lg bg-primary text-white mx-2" key={service.id} href={service.loginUrl}>Login
                            via {service.name}</a>
                    )
                )}
            </div>
        </React.Fragment>
    );
}