import {Contact} from "./contact";
import {Version} from "./project/version";
import {Cluster} from "./cluster";
import {Status} from "./project/status";

export interface Project {
    slug: string,
    number: number,
    name: string,
    title: string,
    description: string,
    coordinator: Contact,
    projectLeader: Contact,
    latestVersion: Version,
    programme: string,
    programmeCall: string,
    primaryCluster: Cluster,
    secondaryCluster?: Cluster,
    labelDate: string,
    status: Status,
    latestVersionTotalCosts: number,
    latestVersionTotalEffort: number
}