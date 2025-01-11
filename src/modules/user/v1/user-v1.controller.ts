import { Controller, Get, Logger } from "@nestjs/common";
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
    RequirePermissions,
    Filtering,
    FilteringParams,
    ApiPaginatedResponses,
    Pagination,
    PaginationParams,
    Sorting,
    SortingParams
} from "src/lib/decorators";
import { UserPermission } from "src/lib/enums";
import { ApiResponse } from "src/lib/shared/dto";
import { User } from "../entities";
import { UserV1Service } from "./user-v1.service";

@ApiBearerAuth()
@ApiTags("User")
@Controller({ path: "user", version: "1" })
@ApiExtraModels(ApiResponse, User)
export class UserV1Controller {
    private readonly logger = new Logger(UserV1Controller.name)
    constructor(private userV1Service: UserV1Service) { }

    @Get()
    @RequirePermissions(UserPermission.READ_USERS)
    @ApiOperation({
        summary: "List Users",
        description: "Retrieve a paginated list of users with optional sorting and filtering capabilities"
    })
    @ApiPaginatedResponses(
        {
            type: User,
            isArray: true,
            message: "Users retrieved successfully"
        },
        {
            sortFields: ['name', 'createdAt'],
            filterFields: ["name"]
        }
    )
    async getListUser(
        @PaginationParams() paginationParams: Pagination,
        @SortingParams(['name', 'createdAt']) sort?: Sorting,
        @FilteringParams(['name']) filter?: Filtering
    ): Promise<ApiResponse<User[]>> {
        try {
            this.logger.log(`Fetching users with pagination: ${JSON.stringify(paginationParams)}, sort: ${JSON.stringify(sort)}, filter: ${JSON.stringify(filter)}`);
            return await this.userV1Service.findAll(paginationParams, sort, filter);
        } catch (error) {
            throw error
        }
    }
}