import {
    Switch,
    Route,
    Redirect,
    useHistory,
    useLocation
} from "react-router-dom";

// import Switch from "react-bootstrap/Switch";

import { useAuth } from "../context/UserContext";

import Login from "./Login/Login";
import Callback from "./Callback/Callback";
import Logout from "./Logout/Logout";
import Project  from "./Project/Project";
import Partner from "./Partner/Partner";
import Statistics from "./Statistics/Statistics";
import { createBrowserHistory } from 'history';


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
    let auth = useAuth();
    return <h3>Account page currently in PageRoutes.js user = "{auth.user}"</h3>;
}

function PublicPage() {
    return <h3>Public</h3>;
}

function HomePage() {
    return <h3>Home</h3>;
}

function ProtectedPage() {
    let auth = useAuth();
    let expire = new Date(auth.authExpire); 
    
    return (
        <div>
            <h3>Protected page with user "{auth.user}"</h3>
            <p>
                auth will expire in "{expire.toString()}" <br />
                checkAuthExpire result "{auth.checkAuthExpire().toString()}" <br />
                AccessToken "{auth.accessToken}" <br />
                RefreshToken "{auth.refreshToken}" <br />
            </p>
        </div>
    );
}

function LoginPage() {
    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();

    let { from } = location.state || { from: { pathname: "/" } };
    let login = () => {
        auth.signin(() => {
            history.replace(from);
        });
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
function PrivateRoute({ children, ...props }) {
    let auth = useAuth();

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

    return auth.user ? (
        <Route {...props} >
            {children}
        </Route>
    ) : (
        <Redirect
            to={{
                pathname: "/login",
                state: { from: location }
            }}
        />
    );

    // but they aren't working with the code from the tutorial
    // when "logined" they aren't rendered
    // when you specify the routes with <PrivateRoute></PrivateRoute> instead of <PrivateRoute /> the code is working
    // i am not sure how the children prop is used in the code and where this code gets his "location"
    return (
        <Route
            {...props}
            render={({ location }) =>
                auth.user ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
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
            <PrivateRoute path='/statistics'
                render={props => <Statistics {...props} />}
            />
            <PrivateRoute path='/project'
                render={props => <Project {...props} />}
            />
            
            {/* <PrivateRoute path='/partner'
                render={props => <Partner {...props} />}
            />  */}

            <PrivateRoute path='/partner'>
                <Partner/>
            </PrivateRoute>


            <Route path="/404" component={GenericNotFound} />
            <Redirect to="/404" />

        </Switch>
    );
}

export default PageRoutes