import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags("Auth")
@Controller({ path: "auth", version: '1' })
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post()
    @ApiOperation({ description: "User Login" })
    @ApiResponse({ status: 200, description: "Success", type: LoginResponseDto })
    @ApiResponse({ status: 400, description: "Bad Request" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async login(@Body() request: LoginRequestDto): Promise<LoginResponseDto> {
        return this.authService.signIn(request);
    }
}