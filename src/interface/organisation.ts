import {Country} from "@/interface/country";
import {Type} from "@/interface/organisation/type";

export interface Organisation {
    id: number,
    slug: string,
    name: string,
    country: Country,
    type: Type
}