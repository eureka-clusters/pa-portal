import {Country} from "@/interface/country";

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    fullName: string,
    email: string,
    isFunder: boolean
    isEurekaSecretariatStaffMember: boolean
    funderCountry: Country | null
}