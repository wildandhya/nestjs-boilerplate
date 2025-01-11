import { CanActivate, ExecutionContext, HttpException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "src/lib/decorators/public.decorator";
import { UserRole } from "src/lib/enums";
import { UserClaims } from "src/lib/types";
import { UserV1Service } from "src/modules/user/v1/user-v1.service";
import { ResponseUtil } from "../utils/response.utils";

@Injectable()
export class JwtGuard implements CanActivate {
    private readonly logger = new Logger(JwtGuard.name)

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private reflector: Reflector,
        private readonly userService: UserV1Service,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new HttpException(
                ResponseUtil.error('Unauthorized', undefined, 401),
                401
            )
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            const user = await this.userService.findById(payload.sub)
            if (!user) {
                throw new HttpException(
                    ResponseUtil.error('Unauthorized', undefined, 401),
                    401
                )
            }

            const claims: UserClaims = {
                roles: [user.role as UserRole],
                permissions: user.permissions
            }
            request.user = {
                ...user,
                claims
            }
        } catch (error) {
            this.logger.error(error)
            throw new HttpException(
                ResponseUtil.error('Unauthorized', undefined, 401),
                401
            )
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authorization = request.headers['authorization'];  // Correct way to access headers in Express
        if (authorization) {
            const [type, token] = authorization.split(' ');
            return type === 'Bearer' ? token : undefined;
        }
        return undefined;
    }

}