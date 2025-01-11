import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { FindOneOptions, Raw, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Filtering } from "src/lib/decorators/filtering.decorator";
import { Pagination } from "src/lib/decorators/pagination.decorator";
import { Sorting } from "src/lib/decorators/sorting.decorator";
import { ApiResponse } from "src/lib/shared/dto/api-response.dto";
import { hash } from "src/lib/shared/utils/encryption.utils";
import { ResponseUtil } from "src/lib/shared/utils/response.utils";
import { getOrder, getWhere } from "src/lib/shared/utils/typeorm.utils";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserClaims } from "src/lib/types";
import { UserRole } from "src/lib/enums";

@Injectable()
export class UserV1Service {
    private readonly logger = new Logger(UserV1Service.name)
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    /**
     * Find all users with optional pagination
     * @param paginationDto Pagination parameters
     * @returns Paginated list of users
     */
    async findAll(
        { page, size, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering
    ): Promise<ApiResponse<User[]>> {
        try {
            const where = getWhere(filter)
            const order = getOrder(sort)
            const [data, total] = await this.userRepository.findAndCount({
                where,
                order,
                take: size,
                skip: offset
            })
            return ResponseUtil.paginate(data, page, size, total)
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException('Failed to retrieve users');
        }
    }

    /**
     * Find one user by email or id
     * @param identifier Email or ID of the user
     * @returns User entity or throws NotFoundException
     */
    async findOne(identifier: string): Promise<User> {
        try {
            const options: FindOneOptions<User> = {
                where: [
                    { emailHash: hash(identifier) },

                ]
            };

            const user = await this.userRepository.findOne(options);

            if (!user) {
                throw new NotFoundException(`User with identifier ${identifier} not found`);
            }

            return user;
        } catch (error) {
            this.logger.error(error)
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to retrieve user');
        }
    }

    async getUserClaims(userId: string): Promise<UserClaims> {
        try {
            const options: FindOneOptions<User> = {
                where: [
                    { id: Raw(alias => `${alias} = CAST(:identifier AS uuid)`, { userId }) }

                ]
            };

            const user = await this.userRepository.findOne(options);

            if (!user) {
                throw new NotFoundException(`User with userId ${userId} not found`);
            }

            return {
                roles: [user.role as UserRole],
                permissions:user.permissions,
                tenantId:user.tenant_id
            };
        } catch (error) {
            this.logger.error(error)
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to retrieve user');
        }
    }

    async findById(identifier: string): Promise<User> {
        try {
            const options: FindOneOptions<User> = {
                where: [
                    { id: Raw(alias => `${alias} = CAST(:identifier AS uuid)`, { identifier }) }
                ]
            };

            const user = await this.userRepository.findOne(options);

            if (!user) {
                throw new NotFoundException(`User with identifier ${identifier} not found`);
            }

            return user;
        } catch (error) {
            this.logger.error(error)
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to retrieve user');
        }
    }

    /**
     * Create a new user
     * @param createUserDto User creation data
     * @returns Created user entity
     */
    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email: createUserDto.email }
            });

            if (existingUser) {
                throw new ConflictException('User with this email already exists');
            }
            const user = this.userRepository.create({
                ...createUserDto,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return await this.userRepository.save(user);
        } catch (error) {
            this.logger.error(error)
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    /**
     * Update an existing user
     * @param id User ID
     * @param updateUserDto User update data
     * @returns Updated user entity
     */
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            const user = await this.findOne(id);

            // If updating email, check if new email is already taken
            if (updateUserDto.email && updateUserDto.email !== user.email) {
                const existingUser = await this.userRepository.findOne({
                    where: { email: updateUserDto.email }
                });

                if (existingUser) {
                    throw new ConflictException('Email already in use');
                }
            }

            Object.assign(user, updateUserDto);
            return await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to update user');
        }
    }

    /**
     * Delete a user
     * @param id User ID
     * @returns void
     */
    async delete(id: string): Promise<void> {
        try {
            const user = await this.findOne(id);
            await this.userRepository.remove(user);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to delete user');
        }
    }

    /**
     * Soft delete a user
     * @param id User ID
     * @returns void
     */
    async softDelete(id: string): Promise<void> {
        try {
            const user = await this.findOne(id);
            user.deletedAt = new Date();
            await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to soft delete user');
        }
    }
}