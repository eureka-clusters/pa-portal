import {PathMatch} from 'react-router-dom';
import {RoutePathDefinition} from '@/routing/route-part-definition';

export type ActiveRoutePathTitleCallbackParams<ParamKey extends string = string> = {
    definition: RoutePathDefinition;
    match: PathMatch<ParamKey>;
    locationPathname: string;
};

export type ActiveRoutePathTitleCallback = (params: ActiveRoutePathTitleCallbackParams) => string;
