import {Organisation} from "../organisation";
import {Contact} from "../contact";

export interface Coordinator {
    id: number,
    slug: string,
    organisation: Organisation,
    isActive: boolean,
    isSelfFunded: boolean,
    isCoordinator: boolean,
    technicalContact: Contact,
}