import { useContext, useEffect} from 'react';
import { UserContext } from "../context/UserContext";
import { Redirect } from 'react-router';
import GetAccessToken from '../function/GetAccessToken';


export default function Callback(props) {

    const { setBearerToken } = useContext(UserContext);

    useEffect(() => {
        const authorizationCode = props.location.search.replace('?code=', '');

        GetAccessToken(authorizationCode).then(bearerToken => setBearerToken(bearerToken));

        

    }, [props.location.search, setBearerToken]);

    return <Redirect to="/statistics" />
}