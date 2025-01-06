import { Controller, Get } from "@nestjs/common";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

// @ApiBearerAuth()
@ApiTags("User")
@Controller({path:"user", version:"1"})
export class UserController {
    constructor(private userService: UserService){}

    @Get()
    @ApiOperation({description:"Get List User"})
    @ApiResponse({status:200, description:"Success"})
    @ApiResponse({status:400, description:"Bad Request"})
    @ApiResponse({status:500, description:"Internal Server Error"})
    async getListUser():Promise<User[]>{
        return this.userService.FindAll()
    }
}