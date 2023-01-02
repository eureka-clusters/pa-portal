import {RoutePathDefinition} from "@/routing/route-part-definition";
import {mapDefinitionToMenu} from "@/component/partial/map-defintion-to-menu";

export interface NavMenuProps {
    routes: RoutePathDefinition[];
}

export const Navigation = ({routes}: NavMenuProps) => {
    const LinksToRender = mapDefinitionToMenu(routes);
    return <>{LinksToRender}</>;
};
