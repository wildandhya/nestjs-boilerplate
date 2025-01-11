import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/modules/user/entities/user.entity";

export class LoginResponseDto {
    @ApiProperty()
    user: Partial<User>

    @ApiProperty()
    access_token: string
}