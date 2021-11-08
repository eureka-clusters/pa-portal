import {Type} from "../version/type";
import {Status} from "../version/status";

export interface Version {
    id: number,
    type: Type,
    status: Status
}