import { 
    Body, 
    Controller, 
    Post, 
    Get,
    Put,
    HttpCode, 
    HttpStatus,
    UseGuards,
    Req,
    Headers,
    UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { 
    ApiOperation, 
    ApiResponse, 
    ApiTags, 
    ApiBearerAuth,
    ApiHeader 
} from '@nestjs/swagger';
import { LoginDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
// import { RefreshTokenDto } from './dto/refresh-token.dto';
// import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { User } from '../v1/decorators/user.decorator';
// import { VerifyEmailDto } from './dto/verify-email.dto';
// import { ThrottlerGuard } from '@nestjs/throttler';
import { Public } from 'src/lib/decorators/public.decorator';

@ApiTags('Authentication')
@Controller({ 
    path: 'auth', 
    version: '1' 
})
// @UseGuards(ThrottlerGuard) // Rate limiting
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'User Login',
        description: 'Authenticate user with email and password'
    })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Successfully authenticated',
        type: LoginResponseDto 
    })
    @ApiResponse({ 
        status: HttpStatus.BAD_REQUEST, 
        description: 'Invalid credentials provided'
    })
    @ApiResponse({ 
        status: HttpStatus.TOO_MANY_REQUESTS, 
        description: 'Too many login attempts'
    })
    async login(
        @Body() request: LoginDto,
        @Headers('user-agent') userAgent: string
    ): Promise<LoginResponseDto> {
        return this.authService.login(request);
    }

    @Post('register')
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
        summary: 'User Registration',
        description: 'Register a new user account'
    })
    @ApiResponse({ 
        status: HttpStatus.CREATED, 
        description: 'Successfully registered',
        type: RegisterResponseDto 
    })
    @ApiResponse({ 
        status: HttpStatus.BAD_REQUEST, 
        description: 'Invalid registration data or email already exists'
    })
    async register(
        @Body() request: RegisterDto,
        @Headers('user-agent') userAgent: string
    ): Promise<RegisterResponseDto> {
        return this.authService.register(request);
    }

    // @Post('refresh-token')
    // @Public()
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({ 
    //     summary: 'Refresh Access Token',
    //     description: 'Get a new access token using refresh token'
    // })
    // @ApiResponse({ 
    //     status: HttpStatus.OK, 
    //     description: 'New access token generated',
    //     type: LoginResponseDto 
    // })
    // @ApiResponse({ 
    //     status: HttpStatus.UNAUTHORIZED, 
    //     description: 'Invalid or expired refresh token'
    // })
    // async refreshToken(
    //     @Body() refreshTokenDto: RefreshTokenDto
    // ): Promise<LoginResponseDto> {
    //     return this.authService.refreshToken(refreshTokenDto.refreshToken);
    // }

    // @Post('logout')
    // @HttpCode(HttpStatus.OK)
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // @ApiOperation({ 
    //     summary: 'User Logout',
    //     description: 'Invalidate current session'
    // })
    // @ApiResponse({ 
    //     status: HttpStatus.OK, 
    //     description: 'Successfully logged out'
    // })
    // async logout(
    //     @User('id') userId: string,
    //     @Headers('authorization') token: string
    // ): Promise<void> {
    //     const bearerToken = token.replace('Bearer ', '');
    //     return this.authService.logout(userId, bearerToken);
    // }

    // @Post('forgot-password')
    // @Public()
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({ 
    //     summary: 'Request Password Reset',
    //     description: 'Send password reset link to email'
    // })
    // @ApiResponse({ 
    //     status: HttpStatus.OK, 
    //     description: 'Password reset email sent'
    // })
    // async forgotPassword(
    //     @Body('email') email: string
    // ): Promise<void> {
    //     return this.authService.forgotPassword(email);
    // }

    // @Post('reset-password')
    // @Public()
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({ 
    //     summary: 'Reset Password',
    //     description: 'Reset password using reset token'
    // })
    // @ApiResponse({ 
    //     status: HttpStatus.OK, 
    //     description: 'Password successfully reset'
    // })
    // async resetPassword(
    //     @Body() resetPasswordDto: ResetPasswordRequestDto
    // ): Promise<void> {
    //     return this.authService.resetPassword(
    //         resetPasswordDto.token,
    //         resetPasswordDto.newPassword
    //     );
    // }

    // @Put('change-password')
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({ 
    //     summary: 'Change Password',
    //     description: 'Change password while authenticated'
    // })
    // @ApiResponse({ 
    //     status: HttpStatus.OK, 
    //     description: 'Password successfully changed'
    // })
    // async changePassword(
    //     @User('id') userId: string,
    //     @Body() changePasswordDto: ChangePasswordDto
    // ): Promise<void> {
    //     return this.authService.changePassword(
    //         userId,
    //         changePasswordDto.currentPassword,
    //         changePasswordDto.newPassword
    //     );
    // }

    // @Post('verify-email')
    // @Public()
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({ 
    //     summary: 'Verify Email',
    //     description: 'Verify user email address'
    // })
    // @ApiResponse({ 
    //     status: HttpStatus.OK, 
    //     description: 'Email successfully verified'
    // })
    // async verifyEmail(
    //     @Body() verifyEmailDto: VerifyEmailDto
    // ): Promise<void> {
    //     return this.authService.verifyEmail(verifyEmailDto.token);
    // }

    // @Get('me')
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // @ApiOperation({ 
    //     summary: 'Get Current User',
    //     description: 'Get current authenticated user details'
    // })
    // @ApiResponse({ 
    //     status: HttpStatus.OK, 
    //     description: 'Current user details retrieved'
    // })
    // async getCurrentUser(@User() user: any) {
    //     return user;
    // }
}