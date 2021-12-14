import {Project} from "interface/project";
import {Contact} from "interface/contact";
import {Organisation} from "interface/organisation";

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
    latestVersionTotalCostsInYear?: number,
    latestVersionTotalEffortInYear?: number,
}