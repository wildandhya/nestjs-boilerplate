import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from 'src/lib/shared/dto/api-response.dto';
import { ResponseUtil } from 'src/lib/shared/utils/response.utils';
import { UserV1Service } from '../../user/v1/user-v1.service';
import { LoginDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@Injectable()
export class AuthV1Service {
    constructor(
        private readonly userService: UserV1Service,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Register a new user
     * @param registerDto Registration data
     * @returns Access token and user data
     */
    async register(registerDto: RegisterDto): Promise<ApiResponse<RegisterResponseDto>> {
        try {
            // Hash the password before storing
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(registerDto.password, salt);

            // Create new user
            const user = await this.userService.create({
                ...registerDto,
                salt: salt,
                password: hashedPassword,
            });

            // Generate JWT token
            const token = this.generateToken(user);
            const data: RegisterResponseDto = {
                user: this.excludePassword(user),
                access_token: token,
            };
            return ResponseUtil.success(data)
        } catch (error) {
            if (error.message.includes('already exists')) {
                throw new BadRequestException('User with this email already exists');
            }
            throw error;
        }
    }

    /**
     * Authenticate user and generate token
     * @param loginDto Login credentials
     * @returns Access token and user data
     */
    async login(loginDto: LoginDto): Promise<ApiResponse<LoginResponseDto>> {
        try {
            // Find user by email
            const user = await this.userService.findOne(loginDto.email);

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(
                loginDto.password,
                user.password,
            );

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Generate JWT token
            const token = this.generateToken(user);
            const data: LoginResponseDto = {
                user: this.excludePassword(user),
                access_token: token,
            };
            return ResponseUtil.success(data)
        } catch (error) {
            throw error;
        }
    }

    /**
     * Validate user for JWT strategy
     * @param payload JWT payload
     * @returns User without password
     */
    async validateUser(payload: { sub: string; email: string }) {
        const user = await this.userService.findOne(payload.sub);
        return this.excludePassword(user);
    }

    /**
     * Generate JWT token
     * @param user User entity
     * @returns JWT token
     */
    private generateToken(user: any) {
        const payload = {
            sub: user.id,
            email: user.email,
        };
        return this.jwtService.sign(payload);
    }

    /**
     * Remove password from user object
     * @param user User entity
     * @returns User without password
     */
    private excludePassword(user: any) {
        const { password, salt, emailHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}