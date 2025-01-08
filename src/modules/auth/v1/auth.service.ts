import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../user/v1/user.service';
import { LoginDto } from './dto/login-request.dto';
import { RegisterDto } from './dto/register-request.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Register a new user
     * @param registerDto Registration data
     * @returns Access token and user data
     */
    async register(registerDto: RegisterDto) {
        try {
            // Hash the password before storing
            const hashedPassword = await bcrypt.hash(registerDto.password, 10);

            // Create new user
            const user = await this.userService.create({
                ...registerDto,
                password: hashedPassword,
            });

            // Generate JWT token
            const token = this.generateToken(user);

            return {
                user: this.excludePassword(user),
                access_token: token,
            };
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
    async login(loginDto: LoginDto) {
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

        return {
            user: this.excludePassword(user),
            access_token: token,
        };
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
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}