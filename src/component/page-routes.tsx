import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {useAuth} from 'context/user-context';
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

function GenericNotFound() {
    const navigate = useNavigate();
    const previousLocation = () => {
        navigate(-1)
    };
    return (
        <section>
            <h1>Page not found</h1>
            <button onClick={previousLocation}>Go back</button>
        </section>
    );
}


function HomePage() {
    return <h1>Home</h1>;
}


// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function ProtectedRoute({auth, children}: { auth: any, children: any }) {
    if (!auth.hasUser()) {
        return (
            <Navigate to={{pathname: "/login"}} replace/>
        );
    }

    return children;
}

export const PageRoutes = () => {

    const auth = useAuth();

    return (
        <Routes>
            <Route index path='/' element={<HomePage/>}/>

            <Route path='/login' element={<Login/>}/>
            <Route path='/logout' element={<Logout/>}/>
            <Route path='/callback' element={<Callback/>}/>

            <Route path='/account' element={<ProtectedRoute auth={auth}><Account/></ProtectedRoute>}/>
            <Route path='/search' element={<ProtectedRoute auth={auth}><Search/></ProtectedRoute>}/>

            <Route path='/statistics/projects'
                   element={<ProtectedRoute auth={auth}><ProjectStatistics/></ProtectedRoute>}/>
            <Route path='/statistics/partners'
                   element={<ProtectedRoute auth={auth}><PartnerStatistics/></ProtectedRoute>}/>
            <Route path='/projects' element={<ProtectedRoute auth={auth}><Projects/></ProtectedRoute>}/>
            <Route path='/project/[:slug]' element={<ProtectedRoute auth={auth}><Project/></ProtectedRoute>}/>
            <Route path='/partner/[:slug]' element={<ProtectedRoute auth={auth}><Partner/></ProtectedRoute>}/>
            <Route path='/organisations' element={<ProtectedRoute auth={auth}><Organisations/></ProtectedRoute>}/>
            <Route path='/organisation/[:slug]' element={<ProtectedRoute auth={auth}><Organisation/></ProtectedRoute>}/>

            <Route path="*" element={<GenericNotFound/>}/>
        </Routes>
    );
}

export default PageRoutes