import {Project} from "../project";
import {Contact} from "../contact";
import {Organisation} from "../organisation";

export interface Partner {
    id: number,
    slug: string,
    project: Project,
    isActive: boolean,
    isSelfFunded: boolean,
    isCoordinator: boolean,
    technicalContact: Contact,
    organisation: Organisation,
    latestVersionCosts: number,
    latestVersionEffort: number,
    year?: number
    latestVersionCostsInYear?: number
    latestVersionEffortInYear?: number
}

export interface PartnerYear {
    id: number,
    slug: string,
    project: Project,
    isActive: boolean,
    isSelfFunded: boolean,
    isCoordinator: boolean,
    technicalContact: Contact,
    organisation: Organisation,
    year: number
    latestVersionCostsInYear: number
    latestVersionEffortInYear: number
}