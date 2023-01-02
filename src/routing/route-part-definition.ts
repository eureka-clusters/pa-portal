import {RouteObject} from "react-router-dom";
import {ActiveRoutePathTitleCallback} from '@/routing/active-route-path-title-callback';

export type RoutePathDefinition = RouteObject & {
    title: string | ActiveRoutePathTitleCallback;
    nav?: boolean;
    children?: RoutePathDefinition[];
    path: string;
};
