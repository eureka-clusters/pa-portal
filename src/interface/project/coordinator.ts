import {Organisation} from "interface/organisation";
import {Contact} from "interface/contact";

export interface Coordinator {
    id: number,
    slug: string,
    organisation: Organisation,
    isActive: boolean,
    isSelfFunded: boolean,
    isCoordinator: boolean,
    technicalContact: Contact,
}