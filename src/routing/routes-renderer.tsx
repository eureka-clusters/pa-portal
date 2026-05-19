import {RouteObject, useRoutes} from "react-router-dom";

import {RoutePathDefinition} from "@/routing/route-part-definition";

export interface RoutesRendererProps {
    routes: RoutePathDefinition[];
}

export function RoutesRenderer({routes}: RoutesRendererProps) {
    return useRoutes(routes as RouteObject[]);
}
