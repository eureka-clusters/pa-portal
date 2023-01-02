import {PathMatch} from 'react-router-dom';
import {RoutePathDefinition} from '@/routing/route-part-definition';

export type ActiveRoutePath = {
    title: string;
    match: PathMatch<string>
    definition: RoutePathDefinition;
};
