import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfigService } from "src/lib/jwt/jwt.service";
import { UserModule } from "../user/user.module";
import { AuthV1Controller } from "./v1/auth-v1.controller";
import { AuthV1Service } from "./v1/auth-v1.service";

@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            useClass: JwtConfigService
        })
    ],
    controllers: [AuthV1Controller],
    providers: [AuthV1Service],
    exports: []
})

export class AuthModule { }