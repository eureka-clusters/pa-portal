import {Contact} from "./contact";
import {Version} from "./project/version";
import {Cluster} from "./cluster";
import {Status} from "./project/status";
import {Coordinator} from "./project/coordinator";

export interface Project {
    slug: string,
    number: number,
    name: string,
    title: string,
    description: string,
    coordinator: Coordinator,
    projectLeader: Contact,
    latestVersion: Version,
    technicalArea: string,
    programme: string,
    programmeCall: string,
    primaryCluster: Cluster,
    secondaryCluster?: Cluster,
    labelDate: string,
    status: Status,
    latestVersionTotalCosts: number,
    latestVersionTotalEffort: number
}