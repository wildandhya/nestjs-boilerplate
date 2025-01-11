import { CanActivate, ExecutionContext, ForbiddenException, HttpCode, HttpException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY, PERMISSIONS_KEY, ROLES_KEY, USER_ACCESS_KEY } from "src/lib/decorators";
import { UserPermission, UserRole } from "src/lib/enums";
import { UserClaims } from "src/lib/types";
import { ResponseUtil } from "../utils/response.utils";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        
        const requiredPermissions = this.reflector.getAllAndOverride<UserPermission[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()]
        ) || [];

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        ) || [];

        const requiresUserOwnership = this.reflector.getAllAndOverride<boolean>(
            USER_ACCESS_KEY,
            [context.getHandler(), context.getClass()]
        );

        const request = context.switchToHttp().getRequest()
        const user = request.user as { id: string; claims: UserClaims };

        if (!user?.claims) {
            throw new HttpException(
                ResponseUtil.error('No user claims found', undefined, 403),
                403
            )
        }

        // Check permissions
        if (requiredPermissions.length > 0) {
            const hasPermissions = requiredPermissions.every(permission =>
                user.claims.permissions.includes(permission)
            );
            if (!hasPermissions) {
                throw new HttpException(
                    ResponseUtil.error(`Missing required permissions: ${requiredPermissions}`, undefined, 403),
                    403
                )
            }
        }

        // Check roles
        if (requiredRoles.length > 0) {
            const hasRoles = requiredRoles.some(role =>
                user.claims.roles.includes(role)
            );
            if (!hasRoles) {
                throw new HttpException(
                    ResponseUtil.error(`Missing required roles: ${requiredRoles}`, undefined, 403),
                    403
                )
            }
        }

        // Check user ownership
        if (requiresUserOwnership) {
            const requestedUserId = request.params.userId || request.params.id;
            if (!requestedUserId) {
                throw new HttpException(
                    ResponseUtil.error('User ID parameter is required', undefined, 403),
                    403
                )
            }

            if (requestedUserId !== user.id && !user.claims.roles.includes(UserRole.ADMIN)) {
                throw new HttpException(
                    ResponseUtil.error('You can only access your own data', undefined, 403),
                    403
                )
            }
        }

        return true;
    }

}