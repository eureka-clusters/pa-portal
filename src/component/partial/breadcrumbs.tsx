import React from "react";
import {RoutePathDefinition} from '@/routing/route-part-definition';
import {useActiveRoutePaths} from '@/routing/use-active-route-paths';
import {Breadcrumb} from "react-bootstrap";

export interface BreadcrumbsProps {
    routes: RoutePathDefinition[];
}

export function Breadcrumbs({routes}: BreadcrumbsProps) {
    const activeRoutePaths = useActiveRoutePaths(routes);
    return (
        <Breadcrumb>
            {activeRoutePaths.map((active, index, {length}) => (
                <Breadcrumb.Item key={index} href={active.match.pathname}>
                    {active.title}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    );
}
