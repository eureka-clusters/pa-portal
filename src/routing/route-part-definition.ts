import { IndexRouteObject, NonIndexRouteObject, RouteObject } from "react-router-dom";
import { ActiveRoutePathTitleCallback } from '@/routing/active-route-path-title-callback';
import React from "react";

// export type RoutePathDefinition = RouteObject & { //This does not work
//     title: string | ActiveRoutePathTitleCallback;
//     nav?: boolean;
//     children?: RoutePathDefinition[];
//     path: string;
// };


export type RoutePathDefinition = {
    element?: React.ReactNode | null;
    title: string | ActiveRoutePathTitleCallback;
    nav?: boolean;
    children?: RoutePathDefinition[];
    path: string;
};
