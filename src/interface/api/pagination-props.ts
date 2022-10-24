import {Organisation} from "../organisation";
import {Project} from "../project";

export interface PaginationProps {
    filter?: string,
    organisation?: Organisation,
    project?: Project
    page: number,
    pageSize?: number,
    sort?: string,
    order?: string,
}

const DefaultPaginationProps = {
    filter: '',
    page: 1,
    pageSize: 10,
}