import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../../lib/database/database.module";
import { userProviders } from "./user.provider";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";


@Module({
    imports:[DatabaseModule],
    controllers:[UserController],
    providers:[
        ...userProviders,
        UserService
    ],
    exports:[UserService]
})

export class UserModule {}