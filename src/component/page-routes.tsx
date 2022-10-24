import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
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
import ProtectedPage from 'component/partial/protected-page';
import PublicPage from 'component/partial/public-page';

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
function PrivateRoute({path, element}: { path: string, element: JSX.Element }) {
    let auth = useAuth();
    const location = useLocation();

    return auth.hasUser() ? (
        <Route path={path} element={element}/>
    ) : (
        <Navigate
            to={{
                pathname: "/login",
                // state: {from: location}
            }}
        />
    );
}

export const PageRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/public' element={<PublicPage/>}/>
            <PrivateRoute path='/protected' element={<ProtectedPage/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/logout' element={<Logout/>}/>
            <Route path='/callback' element={<Callback/>}/>
            <PrivateRoute path='/account' element={<Account/>}/>
            <PrivateRoute path='/search' element={<Search/>}/>
            <PrivateRoute path='/statistics/projects' element={<ProjectStatistics/>}/>
            <PrivateRoute path='/statistics/partners' element={<PartnerStatistics/>}/>
            <PrivateRoute path='/projects' element={<Projects/>}/>
            <PrivateRoute path='/project/[:slug]' element={<Project/>}/>
            <PrivateRoute path='/partner/[:slug]' element={<Partner/>}/>
            <PrivateRoute path='/organisations' element={<Organisations/>}/>
            <PrivateRoute path='/organisation/[:slug]' element={<Organisation/>}/>
            <Route path="/404">
                <GenericNotFound/>
            </Route>
            <Navigate to="/404"/>
        </Routes>
    );
}

export default PageRoutes