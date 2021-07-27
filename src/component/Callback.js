import { useContext, useEffect, useState } from 'react';
import { UserContext } from "../context/UserContext";
import { Redirect } from 'react-router';
import GetAccessToken from '../function/GetAccessToken';
import queryString from 'query-string';

const LoadingComponent = () => <div> Waiting for login... </div>

export default function Callback(props) {

    const { setBearerToken } = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        let params = queryString.parse(props.location.search);

        GetAccessToken(params.code).then(bearerToken => setBearerToken(bearerToken)).then(() => setLoading(false));

    }, [props.location.search, setBearerToken]);

    if (loading) {
        return <LoadingComponent />
    }

    return <Redirect to="/statistics" />
}