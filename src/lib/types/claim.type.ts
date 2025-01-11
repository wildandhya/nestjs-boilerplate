import { UserPermission, UserRole } from "../enums";


export interface UserClaims {
    roles: UserRole[]
    permissions: UserPermission[]
    tenantId?: string
}