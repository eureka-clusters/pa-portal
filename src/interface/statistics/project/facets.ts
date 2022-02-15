export interface Facets {
    countries: Array<{
        name: string,
        amount: number
    }>,
    organisationTypes: Array<{
        name: string,
        amount: number
    }>,
    projectStatus: Array<{
        name: string,
        amount: number
    }>,
    clusters: Array<{
        name: string,
        amount: number
    }>
}