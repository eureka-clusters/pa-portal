import React, {useEffect, useState} from 'react';
import GetProjectData from '../../function/GetProjectData';

import { useAuth } from "../../context/UserContext";

const LoadingComponent = () => <div> Loading project... </div>

export default function Project(props) {

    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)

    let auth = useAuth();

    useEffect(() => {
        GetProjectData(props.match.params.identifier, auth.accessToken).then((res)=>setProject(res)).then(() => setLoading(false));
        
    }, [auth.accessToken, props]);


    if (loading) { return <LoadingComponent /> }
    
    return (
        <React.Fragment>
            <h1>Project Page</h1>

            Project: {project.name}<br />
            Description: {project.description}<br />
            Label date: {project.labelDate}<br />
            Project: {project.name}<br />

            {/* User = {auth.user}<br />
            AccessToken = {auth.accessToken} <br />
            RefreshToken = {auth.refreshToken} <br />            

            Expire = {auth.checkAuthExpire() ? 'valid' : 'invalid'} <br /> */}
        </React.Fragment>
    );
}