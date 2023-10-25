import {Project} from "@/interface/project";
import {Contact} from "@/interface/contact";
import {Organisation} from "@/interface/organisation";

export interface Partner {
    id: number,
    slug: string,
    project: Project,
    isActive: boolean,
    isSelfFunded: boolean,
    isCoordinator: boolean,
    technicalContact: Contact,
    organisation: Organisation,
    projectOutlineCosts: number | null,
    projectOutlineEffort: number | null,
    fullProjectProposalCosts: number | null,
    fullProjectProposalEffort: number | null,
    latestVersionCosts: number | null,
    latestVersionEffort: number | null,
    year?: number
    latestVersionCostsInYear?: number,
    latestVersionEffortInYear?: number,
}