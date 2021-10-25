
import React, { useState, useEffect } from "react";

import Button from 'react-bootstrap/Button'
import { useAuth } from "../../context/UserContext";
import Config from "../../constants/Config";

import { Me } from "./Me";

import axios from 'axios';


const ProtectedPage = () => {
    let auth = useAuth();
    const serverUri = Config.SERVER_URI;
    const url = serverUri + '/api/me';
    
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const [refetch2, setRefetch2] = useState(false);
    const [refetch3, setRefetch3] = useState(false);
    const [refetch4, setRefetch4] = useState(false);

    const getApi = async () => {
        const serverUri = Config.SERVER_URI;
        let accessToken = await auth.getToken();
        console.log('accessToken used in getApi', accessToken);
       
        const instance = axios.create({
            baseURL: serverUri + '/api',
            timeout: 1000,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return instance;
    };


    console.log(' ------------- new page access ---------------');

    useEffect(() => {
        console.log('refetch', refetch);

        // how should the async call be done?
        (async () => {
            let accessToken = await auth.getToken();
            console.log('fetch use Token:', accessToken);
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
        })();


        // or like this
        // const loadData = async () => {
        //     let accessToken =  await auth.getToken()
        //     fetch(url, {
        //         method: 'GET',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json',
        //             'Authorization': 'Bearer ' + accessToken
        //         }
        //     })
        //     .then((response) => response.json())
        //     .then((json) => setData(json))
        //     .catch((error) => console.error(error))
        //     .finally(() => setLoading(false));
        // };
        // loadData();

        // const abortController = new AbortController();
        // void async function getToken() {
        //     let accessToken = await auth.getToken();
        //     void async function fetchData() {
        //         try {
        //             const response = await fetch(url, {
        //                 signal: abortController.signal,
        //                 method: 'GET',
        //                 headers: {
        //                     'Accept': 'application/json',
        //                     'Content-Type': 'application/json',
        //                     'Authorization': 'Bearer ' + accessToken
        //                 }
        //             });
        //             setData(await response.json());
        //         } catch (error) {
        //             console.log('error', error);
        //         }
        //     }();
        //     return () => {
        //         abortController.abort(); // cancel pending fetch request on component unmount
        //     };
        // }();
        
        // or just like this?
        // auth.getToken().then(accessToken => {
        //     console.log('fetch use Token:', accessToken);
        //     fetch(url, {
        //         method: 'GET',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json',
        //             'Authorization': 'Bearer ' + accessToken
        //         }
        //     })
        //     .then((response) => response.json())
        //     .then((json) => setData(json))
        //     .catch((error) => console.error(error))
        //     .finally(() => setLoading(false));
        // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetch]);
    
    // possible problem if the same useEffect is called multiple times (perhaps in Statistics?)
    // invalidate and click the refetch3 button
    useEffect(() => {
        (async function fetchData() {
            let accessToken = await auth.getToken();
            console.log('accessToken 1 in refetch 3', accessToken);
        })();
        (async () => {
            let accessToken = await auth.getToken();
            console.log('accessToken 2 in refetch 3', accessToken);
        })();
        (async () => {
            let accessToken = await auth.getToken();
            console.log('accessToken 3 in refetch 3', accessToken);
        })();
        (async () => {
            let accessToken = await auth.getToken();
            console.log('accessToken 4 in refetch 3', accessToken);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetch3]);

    useEffect(() => {
        (async function fetchData() {
            let accessToken = await auth.getToken();
            console.log('accessToken 2 in refetch4', accessToken);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetch4]);

    useEffect(() => {
        (async function fetchData() {
            let accessToken = await auth.getToken();
            console.log('accessToken 1 in refetch4', accessToken);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetch4]);

    useEffect(() => {
        (async function fetchData() {
            let accessToken = await auth.getToken();
            console.log('accessToken 3 in refetch4', accessToken);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetch4]);

    useEffect(() => {
        (async function fetchData() {
            let accessToken = await auth.getToken();
            console.log('accessToken 4 in refetch4', accessToken);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetch4]);

    useEffect(() => {
        (async () => {
            
            // test by setting only the global defaults https://github.com/axios/axios#global-axios-defaults
            // const serverUri = Config.SERVER_URI;
            // let token = await auth.getToken();
            // axios.defaults.baseURL = serverUri;
            // axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }
            // const instance = axios.create();
            // instance.get('/api/me', {
            //     timeout: 5000
            // });

            // test with api function
            let instance = await getApi();
            instance.get('/me', {
                // settings could be overwritten
                timeout: 5000
            }) // axios automatically returns json in response.data
            .then((response) => setData(response.data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));

            // check to see if  a second getApi() call would generate 2nd accessToken when the Token is currently expired 
            // => it doesn't generate 2 codes 
            // => which is good, so there should be no issue.
            let instance2 = await getApi();
            instance2.get('/me', {
                // settings could be overwritten
                timeout: 5000
            }) // axios automatically returns json in response.data
            .then((response) => setData(response.data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetch2]);





    return (
        <div>
            render me Component:
            <Me />
            <h3>Protected page with user "{auth.user}"</h3>
            <p>
                AccessToken "{auth.accessToken}" <br />
                RefreshToken "{auth.refreshToken}" <br />

                {/* <Button onClick={() => auth.getAccessToken()}>getAccessToken()</Button>  <br /> */}
                {/* <Button onClick={() => auth.getRefreshToken()}>getRefreshToken()</Button>  <br /> */}

                <Button onClick={() => auth.getToken()}>getToken()</Button> auth.getToken() <br />
                
                <Button onClick={() => auth.UseRefreshToken()}>UseRefreshToken()</Button> refresh token manually <br />

                <Button onClick={() => auth.invalidateToken()}>invalidateToken()</Button> invalidate token <br />


                <br />
                <Button onClick={() => setRefetch(!refetch)}>refetch</Button> normal fetch example<br />
                <Button onClick={() => setRefetch2(!refetch2)}>refetch2</Button> Load the data via axios (currently executes 2 request for testing reasons)<br />

                <br />
                <span>Possible issues invalidate before clicking. Both examples generate multiple AccessTokens </span> <br />
                <Button onClick={() => setRefetch3(!refetch3)}>refetch3</Button>  Possible issue of the auth.getToken() is used in the same useeffect call<br />

                <Button onClick={() => setRefetch4(!refetch4)}>refetch4</Button>  Possible issue of the auth.getToken() is used in the multipe useeffect calls<br />

                <br />
                <Button onClick={refreshPage}>Reload page</Button><br />
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