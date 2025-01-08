import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfigService } from "src/lib/jwt/jwt.service";
import { UserModule } from "../../user/v1/user.module";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";


@Module({
    imports: [
        ConfigModule,
        UserModule,
        JwtModule.registerAsync({
            useClass: JwtConfigService
        })
    ],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        }
    ],
    controllers: [AuthController],
    exports: [AuthService]
})

export class AuthModuleV1 { }