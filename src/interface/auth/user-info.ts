export interface UserInfo {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    is_funder: boolean
    is_eureka_secretariat_staff_member: boolean
    funder_country: string,
    funder_clusters: Array<string>
}