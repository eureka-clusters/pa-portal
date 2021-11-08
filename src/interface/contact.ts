export interface Contact {
    full_name: string,
    first_name: string,
    last_name: string,
    email: string,
    cluster_permissions: Array<string>,
    is_funder: boolean,
    funder_country: string
}