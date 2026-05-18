import {lazy, useMemo} from "react";
import {Link} from "react-router-dom";

import {Page} from "@/component/page";
import ProtectedRoute from "@/routing/protected-route";
import {RoutePathDefinition} from "@/routing/route-part-definition";
import {useAuth} from "@/providers/auth-provider";

const Account = lazy(() => import("@/component/account"));
const Callback = lazy(() => import("@/component/callback"));
const Contact = lazy(() => import("@/component/contact"));
const Login = lazy(() => import("@/component/login"));
const Logout = lazy(() => import("@/component/logout"));
const Organisation = lazy(() => import("@/component/organisation"));
const Organisations = lazy(() => import("@/component/organisations"));
const Partner = lazy(() => import("@/component/partner"));
const PartnerList = lazy(() => import("@/component/partners"));
const Project = lazy(() => import("@/component/project"));
const ProjectList = lazy(() => import("@/component/projects"));
const Search = lazy(() => import("@/component/search"));

function withProtection(element: React.ReactNode) {
    return <ProtectedRoute>{element}</ProtectedRoute>;
}

function createAppRoutes(isAuthenticated: boolean): RoutePathDefinition[] {
    return [
        {
            title: "Home",
            path: "/",
            element: isAuthenticated ? (
                <Page title="Home">
                    <p>Welcome to the Eureka Clusters PA Portal.</p>
                </Page>
            ) : (
                <Login/>
            ),
            nav: true,
        },
        {title: "Login", path: "/login", element: <Login/>, nav: false},
        {
            title: "Projects",
            path: "/project",
            element: <Page title="Projects" withOutlet/>,
            nav: isAuthenticated,
            children: [
                {
                    title: "Project list",
                    path: "",
                    element: withProtection(<ProjectList/>),
                    nav: true,
                },
                {
                    title: "Project",
                    path: ":slug",
                    element: withProtection(<Project/>),
                    nav: true,
                },
                {
                    title: "Project partner list",
                    path: "partner",
                    element: withProtection(<PartnerList/>),
                    nav: true,
                },
                {
                    title: "Project partner",
                    path: "partner/:slug",
                    element: withProtection(<Partner/>),
                    nav: true,
                },
            ],
        },
        {
            title: "Organisations",
            path: "/organisations",
            element: <Page title="Organisations" withOutlet/>,
            nav: isAuthenticated,
            children: [
                {
                    title: "Organisation list",
                    path: "",
                    element: withProtection(<Organisations/>),
                    nav: true,
                },
                {
                    title: "Organisation",
                    path: ":slug",
                    element: withProtection(<Organisation/>),
                    nav: true,
                },
            ],
        },
        {
            title: "Search",
            path: "/search",
            element: withProtection(<Search/>),
            nav: isAuthenticated,
        },
        {title: "Logout", path: "/logout", element: <Logout/>, nav: isAuthenticated},
        {title: "Contact", path: "/contact", element: <Contact/>, nav: true},
        {title: "Callback", path: "/callback", element: <Callback/>, nav: false},
        {
            title: "Account",
            path: "/account",
            element: withProtection(<Account/>),
            nav: isAuthenticated,
        },
        {
            title: "404",
            path: "*",
            element: (
                <Page title="404">
                    <p>The page you requested could not be found.</p>
                    <p>
                        <Link to="/">Return to the homepage</Link>
                    </p>
                </Page>
            ),
        },
    ];
}

export function useAppRoutes() {
    const {isAuthenticated} = useAuth();

    return useMemo(() => createAppRoutes(isAuthenticated), [isAuthenticated]);
}
