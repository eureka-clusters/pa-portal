export interface iUserinfo {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    is_funder: boolean
    funder_country: string,
    funder_clusters: Array<string>
}