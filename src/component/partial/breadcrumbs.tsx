import React from "react";
import {Link} from "react-router-dom";
import {RoutePathDefinition} from '@/routing/route-part-definition';
import {useActiveRoutePaths} from '@/routing/use-active-route-paths';

export interface BreadcrumbsProps {
    routes: RoutePathDefinition[];
}

export function Breadcrumbs({routes}: BreadcrumbsProps) {
    const activeRoutePaths = useActiveRoutePaths(routes);
    return (
        <><span>Breadcrumb: </span>
            {activeRoutePaths.map((active, index, {length}) => (
                <span key={index}>
          {index === 0 ? "" : " > "}
                    {index !== length - 1 ? (
                        <Link to={active.match.pathname}>{active.title}</Link>
                    ) : (
                        <>{active.title}</>
                    )}
        </span>
            ))}
        </>
    );
}
