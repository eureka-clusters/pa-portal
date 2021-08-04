import React from "react";
import { Me } from "./Me";
import { MeAxios } from "./MeAxios";

const PublicPage = () => {
    return (
        <React.Fragment>
            <h3>Public</h3>
            <Me/>
            <MeAxios />
        </React.Fragment>
    );
}

export default PublicPage;