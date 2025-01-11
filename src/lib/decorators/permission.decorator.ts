import { SetMetadata } from '@nestjs/common';
import { UserRole, UserPermission } from '../enums';

export const PERMISSIONS_KEY = 'permissions';
export const ROLES_KEY = 'roles';
export const USER_ACCESS_KEY = 'userAccess';

export const RequirePermissions = (...permissions: UserPermission[]) => 
    SetMetadata(PERMISSIONS_KEY, permissions);

export const RequireRoles = (...roles: UserRole[]) => 
    SetMetadata(ROLES_KEY, roles);

export const RequireUserOwnership = () => 
    SetMetadata(USER_ACCESS_KEY, true);