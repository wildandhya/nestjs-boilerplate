import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface Pagination {
    page: number
    size: number
    offset: number
}

export const PaginationParams = createParamDecorator((data, ctx: ExecutionContext): Pagination => {
    const request = ctx.switchToHttp().getRequest();
    const page = parseInt(request.query.page, 10) || 1;
    const size = parseInt(request.query.size, 10) || 10;

    if(isNaN(page) || page < 0 || isNaN(size) || size < 0){
        throw new BadRequestException("Invalid pagination params")
    }

    const offset = (page - 1) * size
    return { page, size, offset };

})