import {useLocation} from "react-router-dom";
import {RoutePathDefinition} from "@/routing/route-part-definition";
import {ActiveRoutePath} from "@/routing/active-route-path";
import {mapDefinitionToActivePath} from "@/routing/map-definition-to-active-path";

export function useActiveRoutePaths(routes: RoutePathDefinition[]): ActiveRoutePath[] {
    const location = useLocation();
    return mapDefinitionToActivePath(routes, location.pathname);
}
