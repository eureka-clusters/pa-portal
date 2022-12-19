import {Navigate, Route, Routes, useNavigate} from "react-router-dom";

import Login from 'component/login';
import Callback from 'component/callback';
import Logout from 'component/logout';
import Account from 'component/account';
import Projects from 'component/projects';
import Project from 'component/project';
import Partner from 'component/partner';
import Search from 'component/search';

import Organisations from 'component/organisations';
import Organisation from 'component/organisation'

import ProjectStatistics from 'component/statistics/projects'
import PartnerStatistics from 'component/statistics/partners'
import {useContext} from "react";
import {AuthContext, AuthState} from "../providers/auth-provider";

function GenericNotFound() {
    const navigate = useNavigate();
    const previousLocation = () => {
        navigate(-1)
    };
    return (
        <section>
            <h1>Page not found</h1>
            <p>The selected page could not be found</p>
            <button className={'btn btn-primary'} onClick={previousLocation}>Go back</button>
        </section>
    );
}


function HomePage() {
    return <h1>Home</h1>;
}


// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function ProtectedRoute({authState, children}: { authState: AuthState, children: any }) {
    if (!authState.authenticated) {
        return (
            <Navigate to={{pathname: "/login"}} replace/>
        );
    }

    return children;
}

export const PageRoutes = () => {

    const authContext = useContext(AuthContext);

    return (
        <Routes>
            <Route index path='/' element={<HomePage/>}/>

            <Route path='/login' element={<Login/>}/>
            <Route path='/logout' element={<Logout/>}/>
            <Route path='/callback' element={<Callback/>}/>

            <Route path='/account'
                   element={<ProtectedRoute authState={authContext.authState}><Account/></ProtectedRoute>}/>
            <Route path='/search'
                   element={<ProtectedRoute authState={authContext.authState}><Search/></ProtectedRoute>}/>

            <Route path='/statistics/projects'
                   element={<ProtectedRoute authState={authContext.authState}><ProjectStatistics/></ProtectedRoute>}/>
            <Route path='/statistics/partners'
                   element={<ProtectedRoute authState={authContext.authState}><PartnerStatistics/></ProtectedRoute>}/>
            <Route path='/projects'
                   element={<ProtectedRoute authState={authContext.authState}><Projects/></ProtectedRoute>}/>
            <Route path='/project/:slug'
                   element={<ProtectedRoute authState={authContext.authState}><Project/></ProtectedRoute>}/>
            <Route path='/partner/:slug'
                   element={<ProtectedRoute authState={authContext.authState}><Partner/></ProtectedRoute>}/>
            <Route path='/organisations'
                   element={<ProtectedRoute authState={authContext.authState}><Organisations/></ProtectedRoute>}/>
            <Route path='/organisation/:slug'
                   element={<ProtectedRoute authState={authContext.authState}><Organisation/></ProtectedRoute>}/>

            <Route path="*" element={<GenericNotFound/>}/>
        </Routes>
    );
}

export default PageRoutes