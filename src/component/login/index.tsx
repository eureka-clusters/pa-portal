import axios from "axios";
import {useQuery} from "@tanstack/react-query";

import {QueryState} from "@/component/partial/query-state";
import {getServerUri} from "@/functions/get-server-uri";
import {Service} from "@/interface/service";

export default function Login() {
    const servicesQuery = useQuery({
        queryKey: ["services"],
        queryFn: async () => {
            const response = await axios.get<{ _embedded: { items: Service[] } }>(`${getServerUri()}/api/list/service`);
            return response.data._embedded.items;
        },
    });

    if (servicesQuery.isLoading || servicesQuery.isError) {
        return (
            <QueryState
                isLoading={servicesQuery.isLoading}
                isError={servicesQuery.isError}
                errorMessage="The available login services could not be loaded."
            />
        );
    }

    return (
        <>
            <div className="d-flex p-2 bd-highlight">
                <div className="jumbotron">
                    <h1 className="display-4">Welcome to Eureka Clusters Portal</h1>
                    <p>You can log in using your account in one of the cluster portals shown below.</p>
                </div>
            </div>
            <div className="d-flex flex-row bd-highlight mb-3">
                {servicesQuery.data?.map((service) => (
                    <a className="btn btn-lg bg-primary text-white mx-2" key={service.id} href={service.loginUrl}>
                        Login via {service.name}
                    </a>
                ))}
            </div>
        </>
    );
}
