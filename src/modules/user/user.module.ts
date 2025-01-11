import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserV1Controller } from "./v1/user-v1.controller";
import { UserV1Service } from "./v1/user-v1.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    controllers:[UserV1Controller],
    providers:[UserV1Service],
    exports: [UserV1Service]
})
export class UserModule { }