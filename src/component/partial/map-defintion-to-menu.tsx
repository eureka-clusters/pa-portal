import React from "react";
import {generatePath, NavLink} from "react-router-dom";
import {Nav} from 'react-bootstrap';
import {concatPaths} from '@/routing/route-helpers';
import {RoutePathDefinition} from "@/routing/route-part-definition";

export function mapDefinitionToMenu(definitions: RoutePathDefinition[], parent: string = ""): React.ReactNode {
    return (
        <>
            {definitions.map((definition, index) => {
                if (!definition.nav) {
                    return undefined;
                }
                const builtPath = concatPaths(parent, definition.path);
                let to: string | undefined;
                try {
                    to = generatePath(builtPath);
                } catch (err) {
                }
                return (
                    <React.Fragment key={index}>
                        {to ? (
                            <>
                                <Nav.Link as={NavLink} key={index} to={to}>{definition.title}</Nav.Link>

                                {definition.children ? mapDefinitionToMenu(definition.children, builtPath) : undefined}
                            </>

                        ) : undefined}
                    </React.Fragment>
                );
            })}
        </>
    );
}
