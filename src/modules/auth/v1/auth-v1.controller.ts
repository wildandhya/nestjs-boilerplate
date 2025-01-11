import {
    Body,
    Controller,
    Headers,
    HttpCode,
    HttpStatus,
    Post
} from '@nestjs/common';
import {
    ApiExtraModels,
    ApiOperation,
    ApiTags
} from '@nestjs/swagger';
import { ApiCommonResponse } from 'src/lib/decorators/api.decorator';
import { Public } from 'src/lib/decorators/public.decorator';
import { ApiResponse } from 'src/lib/shared/dto/api-response.dto';
import { AuthV1Service } from './auth-v1.service';
import { LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto } from './dto';

@ApiTags('Authentication')
@ApiExtraModels(LoginResponseDto, RegisterResponseDto)
@Controller({ path: 'auth', version: '1' })
export class AuthV1Controller {
    constructor(private authService: AuthV1Service) { }

    @Post('login')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'User Login',
        description: 'Authenticate user with email and password'
    })
    @ApiCommonResponse({
        type: LoginResponseDto,
        message: "Successfully authenticated"
    })
    async login(
        @Body() request: LoginDto,
        @Headers('user-agent') userAgent: string
    ): Promise<ApiResponse<LoginResponseDto>> {
        try {
            const result = await this.authService.login(request);
            return result
        } catch (error) {
            throw error
        }
    }

    @Post('register')
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'User Registration',
        description: 'Register a new user account'
    })
    @ApiCommonResponse({
        type: RegisterResponseDto,
        message: "Successfully registered"
    })
    async register(
        @Body() request: RegisterDto,
        @Headers('user-agent') userAgent: string
    ): Promise<ApiResponse<RegisterResponseDto>> {
        return await this.authService.register(request);
    }
}