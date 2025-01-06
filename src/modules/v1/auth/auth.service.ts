import { Body, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { LoginRequestDto } from "./dto/login-request.dto";
import { LoginResponseDto } from "./dto/login-response.dto";

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async signIn(@Body() request:LoginRequestDto): Promise<LoginResponseDto> {
        const user = await this.userService.FindOne(request.email)
        if (user?.password !== request.password) {
            throw new UnauthorizedException()
        }
        const payload = { sub: user.id }
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}