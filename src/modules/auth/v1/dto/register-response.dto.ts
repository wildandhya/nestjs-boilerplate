import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "src/lib/shared/response";

export class RegisterResponseDto {
    @ApiProperty()
    access_token: string
}