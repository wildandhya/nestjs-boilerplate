import { Module } from "@nestjs/common";
import { AuthModuleV1 } from "./v1/auth.module";

@Module({
    imports:[AuthModuleV1]
})

export class AuthModule { }