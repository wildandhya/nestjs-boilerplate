import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @ApiProperty()
    full_name: string;

    @ApiProperty()
    tenant_id: string;

    @IsEmail()
    @ApiProperty()
    email: string

    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @IsNotEmpty()
    @ApiProperty()
    role: string;

    @IsNotEmpty()
    @ApiProperty()
    user_type: string;
}