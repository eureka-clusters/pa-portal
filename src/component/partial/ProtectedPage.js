
import React, { useContext, createContext, useState, useEffect } from "react";
import Button from 'react-bootstrap/Button'
import { useAuth } from "../../context/UserContext";
import Config from "../../constants/Config";




const ProtectedPage = () => {
    let auth = useAuth();
    const serverUri = Config.SERVER_URI;
    const url = serverUri + '/api/me';
    
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [refetch, setRefetch] = useState(false);

    console.log(' ------------- new page access ---------------');
    

    useEffect(() => {
        console.log('refetch', refetch);
        const accessToken = auth.getToken();

        console.log('fetch use Token:', accessToken, accessToken.value);
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }, [refetch]);
   
    return (
        <div>
            <h3>Protected page with user "{auth.user}"</h3>
            <p>
                AccessToken "{auth.accessToken}" <br />
                RefreshToken "{auth.refreshToken}" <br />

                <Button onClick={() => auth.getToken()}>getToken()</Button> <br />

                {/* <Button onClick={() => auth.getAccessToken()}>getAccessToken()</Button>  <br /> */}
                {/* <Button onClick={() => auth.getRefreshToken()}>getRefreshToken()</Button>  <br /> */}

                <Button onClick={() => auth.UseRefreshToken()}>UseRefreshToken()</Button>  <br />

                <Button onClick={() => auth.invalidateToken()}>invalidateToken()</Button>  <br />
                <Button onClick={() => setRefetch(!refetch)}>RefreshData</Button> <br />
                <Button onClick={refreshPage}>Reload</Button>  <br />
            </p>
            <h3>data from api call:</h3>
            <p>
                {data.firstName} {data.lastName} ({data.email})<br />
            </p>
        </div>
    );

    function refreshPage() {
        window.location.reload();
    }
};



export default ProtectedPage;