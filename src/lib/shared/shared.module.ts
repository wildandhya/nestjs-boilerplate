import { Global, Module } from "@nestjs/common";
import { JwtGuard } from "./guards/jwt.guard";
import { UserModule } from "src/modules/user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfigService } from "../jwt/jwt.service";
import { JWTModule } from "../jwt/jwt.module";
import { ConfigModule } from "@nestjs/config";
import { PermissionGuard } from "./guards/permission.guard";

@Global()
@Module({
    imports: [
        ConfigModule,
        UserModule,
        JwtModule.registerAsync({
            useClass:JwtConfigService
        })
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        },
        {
            provide: APP_GUARD,
            useClass: PermissionGuard,
        }
    ],
    exports: []
})
export class SharedModule { }