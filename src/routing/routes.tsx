import {Page} from "@/component/page";
import Login from "@/component/login";
import Logout from "@/component/logout";
import Callback from "@/component/callback";
import {AuthContext} from "@/providers/auth-provider";
import Account from "@/component/account";
import ProtectedRoute from "@/routing/protected-route";
import {useContext} from "react";
import Search from "@/component/search";
import ProjectStatistics from "@/component/statistics/projects";
import PartnerStatistics from "@/component/statistics/partners";
import Projects from "@/component/projects";
import Project from "@/component/project";
import {ActiveRoutePathTitleCallbackParams} from "@/routing/active-route-path-title-callback";
import Organisations from "@/component/organisations";
import Organisation from "@/component/organisation";
import Partner from "@/component/partner";
import {RoutePathDefinition} from "@/routing/route-part-definition";


//export const routes: RoutePathDefinition[] = [
export default function pageRoutes(): RoutePathDefinition[] {

    const authContext = useContext(AuthContext);

    return [
        {title: "Home", path: "/", element: <Page title="Home"/>, nav: true},
        {title: "Login", path: "/login", element: <Login/>, nav: !authContext.isAuthenticated()},
        {title: "Logout", path: "/logout", element: <Logout/>, nav: authContext.isAuthenticated()},
        {title: "Callback", path: "/callback", element: <Callback/>, nav: false},
        {
            title: "Account",
            path: "/account",
            element: <ProtectedRoute isAuthenticated={authContext.isAuthenticated()}><Account/></ProtectedRoute>,
            nav: authContext.isAuthenticated()
        },
        {
            title: "Search",
            path: "/search",
            element: <ProtectedRoute isAuthenticated={authContext.isAuthenticated()}><Search/></ProtectedRoute>,
            nav: authContext.isAuthenticated()
        },
        {
            title: "Statistics",
            path: "/statistics",
            element: <Page title="Statistics" withOutlet/>,
            nav: authContext.isAuthenticated(),
            children: [
                {
                    title: 'Projects (stats)',
                    path: "projects",
                    element: <ProtectedRoute
                        isAuthenticated={authContext.isAuthenticated()}><ProjectStatistics/></ProtectedRoute>,
                    nav: true
                },
                {
                    title: "Partners (stats)",
                    path: "partners",
                    element: <ProtectedRoute
                        isAuthenticated={authContext.isAuthenticated()}><PartnerStatistics/></ProtectedRoute>,
                    nav: true
                },
            ]
        },
        {
            title: "Projects",
            path: "/projects",
            element: <Page title="Projects" withOutlet/>,
            nav: authContext.isAuthenticated(),
            children: [
                {
                    title: "Project list",
                    path: "",
                    element: <ProtectedRoute
                        isAuthenticated={authContext.isAuthenticated()}><Projects/></ProtectedRoute>,
                    nav: true
                },
                {
                    title: ({match}: ActiveRoutePathTitleCallbackParams<'id'>) => `Param-${match.params.id}`,
                    path: ":slug",
                    element: <ProtectedRoute
                        isAuthenticated={authContext.isAuthenticated()}><Project/></ProtectedRoute>,
                    nav: true,
                },
                {
                    title: ({match}: ActiveRoutePathTitleCallbackParams<'id'>) => `Param-${match.params.id}`,
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
                    title: "Organisations (list)",
                    path: "list",
                    element: <ProtectedRoute
                        isAuthenticated={authContext.isAuthenticated()}><Organisations/></ProtectedRoute>,
                    nav: true
                },
                {
                    title: ({match}: ActiveRoutePathTitleCallbackParams<'id'>) => `Param-${match.params.id}`,
                    path: "organisation/:slug",
                    element: <ProtectedRoute
                        isAuthenticated={authContext.isAuthenticated()}><Organisation/></ProtectedRoute>,
                    nav: true
                },
            ]
        },
        {
            title: "Catch All - 404",
            path: "*",
            element: <Page title="404"/>,
        },
    ];
};
