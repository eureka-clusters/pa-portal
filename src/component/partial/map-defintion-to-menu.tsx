import React from "react";
import {generatePath, NavLink} from "react-router-dom";
import {Nav, NavDropdown} from 'react-bootstrap';
import {concatPaths} from '@/routing/route-helpers';
import {RoutePathDefinition} from "@/routing/route-part-definition";

export function mapDefinitionToMenu(definitions: RoutePathDefinition[], parent: string = "", isChild: boolean = false): React.ReactNode {
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

                //This has to be done because the title should be a ReactNode
                const title: string = definition.title.toString()

                return (
                    <React.Fragment key={index}>
                        {to ? (
                            <>
                                {definition.children && definition.children.length > 0 &&
                                    <NavDropdown title={title} id="basic-nav-dropdown">
                                        {mapDefinitionToMenu(definition.children, builtPath, true)}
                                    </NavDropdown>
                                }

                                {!definition.children && !isChild &&
                                    <Nav.Link as={NavLink} key={index} to={to}>{title}</Nav.Link>
                                }

                                {!definition.children && isChild &&
                                    <NavDropdown.Item as={NavLink} key={index} to={to}>{title}</NavDropdown.Item>
                                }
                                {/*{definition.children ? mapDefinitionToMenu(definition.children, builtPath) : undefined}*/}


                            </>

                        ) : undefined}
                    </React.Fragment>
                );
            })}
        </>
    );
}
