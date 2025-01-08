import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty()
    full_name: string;

    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @ApiProperty()
    tenant_id?: string

    @ApiProperty()
    salt?: string

    @IsNotEmpty()
    @ApiProperty()
    role: string

    @IsNotEmpty()
    @ApiProperty()
    user_type: string
}
