import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";


@Module({
    imports: [
        UserModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: "1h" }
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

export class AuthModule { }