import {Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";

// import Switch from "react-bootstrap/Switch";
import {UseAuth} from "../context/user-context";

import Login from "./login";
import Callback from "./callback";
import Logout from "./logout";

import Projects from "./projects";
import Project from "./project";

import Organisations from "./organisations";
import Organisation from "./organisation"

import ProjectStatistics from "./statistics/projects"
import PartnerStatistics from "./statistics/partners"

import Partner from "./partner";

import ProtectedPage from "./partial/protected-page";
import PublicPage from "./partial/public-page";

import {createBrowserHistory} from 'history';

// const GenericNotFound = () => {
function GenericNotFound() {
    const browserHistory = createBrowserHistory();
    const previousLocation = () => {
        browserHistory.goBack();
    };
    return (
        <section>
            <h1>Page not found</h1>
            <button onClick={previousLocation}>Go back</button>
        </section>
    );
};

// test page
function AccountPage() {
    let auth = UseAuth();
    return <h3>Account page currently in PageRoutes.js user = "{auth.user}"</h3>;
}


function HomePage() {
    return <h3>Home</h3>;
}

function LoginPage() {
    let history = useHistory();
    let location = useLocation();
    let auth = UseAuth();

    let {from} = location.state || {from: {pathname: "/"}};
    let login = () => {
        history.replace('/login');
    };

    return (
        <div>
            <p>You must log in to view the page at {from.pathname}</p>
            <button onClick={login}>Log in</button>
        </div>
    );
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({children, ...props}) {
    let auth = UseAuth();

    // @Johan
    // with the following code routes like below are working
    // <PrivateRoute path='/partner'
    //      render = { props => < Partner {...props } />}
    // />
    // also routes given as:
    //  <PrivateRoute path='/partner'>
    //      <Partner />
    //  </PrivateRoute >

    const location = useLocation();

    return auth.hasUser() ? (
        <Route {...props} >
            {children}
        </Route>
    ) : (
        <Redirect
            to={{
                pathname: "/login",
                state: {from: location}
            }}
        />
    );
}

export const PageRoutes = () => {

    return (
        <Switch>
            <Route path='/' exact
                   render={props => <HomePage {...props} />}
            />
            <Route path='/public'
                   render={props => <PublicPage {...props} />}
            />
            <Route path='/login2'
                   render={props => <LoginPage {...props} />}
            />
            <PrivateRoute path='/protected'
                          render={props => <ProtectedPage {...props} />}
            />
            <Route path='/login'
                   render={props => <Login {...props} />}
            />
            <Route path='/logout'
                   render={props => <Logout {...props} />}
            />
            <Route path='/callback'
                   render={props => <Callback {...props} />}
            />
            <PrivateRoute path='/account'
                          render={props => <AccountPage {...props} />}
            />
            <PrivateRoute path='/statistics/projects'
                          render={props => <ProjectStatistics {...props} />}
            />
            <PrivateRoute path='/statistics/partners'
                          render={props => <PartnerStatistics {...props} />}
            />

            <PrivateRoute path='/projects'
                          render={props => <Projects {...props} />}
            />
            <PrivateRoute path='/project/:slug'
                          render={props => <Project {...props} />}
            />

            <PrivateRoute path='/organisations'
                          render={props => <Organisations {...props} />}
            />

            <PrivateRoute path='/organisation/:slug'
                          render={props => <Organisation {...props} />}
            />

            <PrivateRoute path='/partner/:slug'
                          render={props => <Partner {...props} />}
            />

            <Route path="/404" component={GenericNotFound}/>
            <Redirect to="/404"/>

        </Switch>
    );
}

export default PageRoutes