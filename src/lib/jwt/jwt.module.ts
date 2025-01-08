import { Module } from "@nestjs/common";
import { JwtConfigService } from "./jwt.service";
import { ConfigModule } from "src/config/config.module";


@Module({
    imports:[],
    providers:[JwtConfigService],
    exports:[JwtConfigService]
})

export class JWTModule{}