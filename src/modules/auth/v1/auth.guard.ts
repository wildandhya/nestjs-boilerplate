import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as fs from 'fs';
import * as path from 'path';
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/lib/decorators/public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private configService: ConfigService, private reflector: Reflector) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);
          if (isPublic) {
            // 💡 See this condition
            return true;
          }

        const publicKeyPath = this.configService.get<string>('JWT_PUBLIC_KEY_PATH');

        if (!publicKeyPath) {
            throw new Error('Private or Public Key paths are not configured properly.');
        }

        const publicKey = fs.readFileSync(path.resolve(publicKeyPath), 'utf8');

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    publicKey: publicKey
                }
            );
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;
        } catch {
            console.log("SINI")
            throw new UnauthorizedException();
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