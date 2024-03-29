import {Type} from "@/interface/version/type";
import {Status} from "@/interface/version/status";

export interface Version {
    id: number,
    type: Type,
    status: Status,
    dateSubmitted: Date,
    isLatestVersionAndIsFPP: boolean,
    effort: number,
    costs: number
}