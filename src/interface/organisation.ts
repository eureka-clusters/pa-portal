import {Country} from "./country";
import {Type} from "./organisation/type";

export interface Organisation {
    id: number,
    slug: string,
    name: string,
    country: Country,
    type: Type
}