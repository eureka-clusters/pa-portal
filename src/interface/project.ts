import {Contact} from "@/interface/contact";
import {Version} from "@/interface/project/version";
import {Cluster} from "@/interface/cluster";
import {Status} from "@/interface/project/status";
import {Coordinator} from "@/interface/project/coordinator";

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
    labelDate?: string,
    officialStartDate?: string,
    officialEndDate?: string,
    status: Status,
    projectOutlineTotalCosts: number | null,
    projectOutlineTotalEffort: number | null,
    fullProjectProposalTotalCosts: number,
    fullProjectProposalTotalEffort: number
    latestVersionTotalCosts: number,
    latestVersionTotalEffort: number
}