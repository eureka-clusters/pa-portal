import {lazy, ReactElement, useMemo} from "react";
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

function withProtection(element: ReactElement) {
    return <ProtectedRoute>{element}</ProtectedRoute>;
}

function createLayoutRoute(
    title: string,
    path: string,
    nav: boolean,
    children: RoutePathDefinition[],
): RoutePathDefinition {
    return {
        title,
        path,
        element: <Page withOutlet/>,
        nav,
        children,
    };
}

function createProtectedRoute(
    title: string,
    element: ReactElement,
    options: Pick<RoutePathDefinition, "path" | "index" | "nav">,
): RoutePathDefinition {
    return {
        title,
        ...options,
        element: withProtection(element),
    };
}

function createAppRoutes(isAuthenticated: boolean): RoutePathDefinition[] {
    const projectRoutes: RoutePathDefinition[] = [
        createProtectedRoute("Project list", <ProjectList/>, {
            index: true,
            nav: true,
        }),
        createProtectedRoute("Project", <Project/>, {
            path: ":slug",
            nav: true,
        }),
        createProtectedRoute("Project partner list", <PartnerList/>, {
            path: "partner",
            nav: true,
        }),
        createProtectedRoute("Project partner", <Partner/>, {
            path: "partner/:slug",
            nav: true,
        }),
    ];

    const organisationRoutes: RoutePathDefinition[] = [
        createProtectedRoute("Organisation list", <Organisations/>, {
            index: true,
            nav: true,
        }),
        createProtectedRoute("Organisation", <Organisation/>, {
            path: ":slug",
            nav: true,
        }),
    ];

    return [
        {
            title: "Home",
            path: "/",
            element: isAuthenticated ? (
                <Page>
                    <p>Welcome to the Eureka Clusters PA Portal.</p>
                </Page>
            ) : (
                <Login/>
            ),
            nav: true,
        },
        {title: "Login", path: "/login", element: <Login/>, nav: false},
        createLayoutRoute("Projects", "/project", isAuthenticated, projectRoutes),
        createLayoutRoute("Organisations", "/organisations", isAuthenticated, organisationRoutes),
        {
            title: "Search",
            path: "/search",
            element: withProtection(<Search/>),
            nav: isAuthenticated,
        },
        {title: "Logout", path: "/logout", element: <Logout/>, nav: false},
        {title: "Contact", path: "/contact", element: <Contact/>, nav: true},
        {title: "Callback", path: "/callback", element: <Callback/>, nav: false},
        {
            title: "Account",
            path: "/account",
            element: withProtection(<Account/>),
            nav: false,
        },
        {
            title: "404",
            path: "*",
            element: (
                <Page>
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
