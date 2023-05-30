import {Page} from "@/component/page";
import Login from "@/component/login";
import Logout from "@/component/logout";
import Callback from "@/component/callback";
import {AuthContext} from "@/providers/auth-provider";
import Account from "@/component/account";
import ProtectedRoute from "@/routing/protected-route";
import {useContext} from "react";
import Search from "@/component/search";
import ProjectList from "@/component/projects";
import Partner from "@/component/partner";
import PartnerList from "@/component/partners";
import Project from "@/component/project";
import Contact from "@/component/contact";
import {ActiveRoutePathTitleCallbackParams} from "@/routing/active-route-path-title-callback";
import Organisations from "@/component/organisations";
import Organisation from "@/component/organisation";
import {RoutePathDefinition} from "@/routing/route-part-definition";

export default function pageRoutes(): RoutePathDefinition[] {

    const authContext = useContext(AuthContext);

    return [
        {title: "Home", path: "/", element: authContext.isAuthenticated() ? <Page title="Home"/> : <Login/>, nav: true},
        {title: "Login", path: "/login", element: <Login/>, nav: false},
        {
            title: "Projects",
            path: "/project",
            element: <Page title="" withOutlet/>,
            nav: authContext.isAuthenticated(),
            children: [
                {
                    title: "Project list",
                    path: "",
                    element: <ProtectedRoute
                        isAuthenticated={authContext.isAuthenticated()}><ProjectList/></ProtectedRoute>,
                    nav: true
                },
                {
                    title: ({match}: ActiveRoutePathTitleCallbackParams<'id'>) => `Project`,
                    path: ":slug",
                    element: <ProtectedRoute
                        isAuthenticated={authContext.isAuthenticated()}><Project/></ProtectedRoute>,
                    nav: true,
                },
                {
                    title: "Project partner list",
                    path: "partner",
                    element: <ProtectedRoute
                        isAuthenticated={authContext.isAuthenticated()}><PartnerList/></ProtectedRoute>,
                    nav: true
                },
                {
                    title: ({match}: ActiveRoutePathTitleCallbackParams<'id'>) => `Project Partner`,
                    path: "partner/:slug",
                    element: <ProtectedRoute
                        isAuthenticated={authContext.isAuthenticated()}><Partner/></ProtectedRoute>,
                    nav: true
                }
            ]
        },
        {
            title: "Organisations",
            path: "/organisations",
            element: <Page title="Organisations" withOutlet/>,
            nav: authContext.isAuthenticated(),
            children: [
                {
                    title: "Organisation list",
                    path: "",
                    element: <ProtectedRoute
                        isAuthenticated={authContext.isAuthenticated()}><Organisations/></ProtectedRoute>,
                    nav: true
                },
                {
                    title: ({match}: ActiveRoutePathTitleCallbackParams<'id'>) => `Organisation`,
                    path: ":slug",
                    element: <ProtectedRoute
                        isAuthenticated={authContext.isAuthenticated()}><Organisation/></ProtectedRoute>,
                    nav: true
                },
            ]
        },
        {
            title: "Search",
            path: "/search",
            element: <ProtectedRoute isAuthenticated={authContext.isAuthenticated()}><Search/></ProtectedRoute>,
            nav: authContext.isAuthenticated()
        },
        {title: "Logout", path: "/logout", element: <Logout/>, nav: authContext.isAuthenticated()},
        {title: "Contact", path: "/contact", element: <Contact/>, nav: true},
        {title: "Callback", path: "/callback", element: <Callback/>, nav: false},
        {
            title: "Account",
            path: "/account",
            element: <ProtectedRoute isAuthenticated={authContext.isAuthenticated()}><Account/></ProtectedRoute>,
            nav: authContext.isAuthenticated()
        },

        {
            title: "Catch All - 404",
            path: "*",
            element: <Page title="404"/>,
        },
    ];
};
