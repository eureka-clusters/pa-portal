import {ActiveRoutePathTitleCallback} from '@/routing/active-route-path-title-callback';
import {RouteObject} from "react-router-dom";

export type RoutePathDefinition = Omit<RouteObject, "children" | "handle"> & {
    title: string | ActiveRoutePathTitleCallback;
    nav?: boolean;
    children?: RoutePathDefinition[];
    path?: string;
};
