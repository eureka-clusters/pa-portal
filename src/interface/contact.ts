export interface Contact {
    fullName: string,
    firstName: string,
    lastName: string,
    email: string,
    clusterPermissions: Array<string>,
    isFunder: boolean,
    funderCountry: string
}