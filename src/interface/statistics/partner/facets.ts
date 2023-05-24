export interface Facets {
    countries: Array<{
        id: number,
        name: string,
        amount: number
    }>,
    organisationTypes: Array<{
        id: number,
        name: string,
        amount: number
    }>,
    projectStatus: Array<{
        id: number,
        name: string,
        amount: number
    }>,
    clusterGroups: Array<{
        id: number,
        name: string,
        amount: number
    }>,
    programmeCalls: Array<{
        id: string,
        name: string,
        amount: number
    }>,
    years: Array<number>,
}