import { Inject, Injectable, NotFoundException, ConflictException, InternalServerErrorException } from "@nestjs/common";
import { Repository, FindOneOptions } from "typeorm";
import { User } from "./user.entity";

import { PaginationDto } from "src/lib/shared/dto/pagination.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    /**
     * Find all users with optional pagination
     * @param paginationDto Pagination parameters
     * @returns Paginated list of users
     */
    async findAll(paginationDto?: PaginationDto): Promise<{users: User[], total: number}> {
        try {
            const { page = 1, limit = 10 } = paginationDto || {};
            const skip = (page - 1) * limit;

            const [users, total] = await this.userRepository.findAndCount({
                skip,
                take: limit,
                order: { createdAt: 'DESC' }
            });

            return { users, total };
        } catch (error) {
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
                    { email: identifier },
                    { id: identifier }
                ]
            };

            const user = await this.userRepository.findOne(options);

            if (!user) {
                throw new NotFoundException(`User with identifier ${identifier} not found`);
            }

            return user;
        } catch (error) {
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

    /**
     * Search users by criteria
     * @param searchTerm Search term for name or email
     * @param paginationDto Pagination parameters
     * @returns Paginated list of matching users
     */
    async search(searchTerm: string, paginationDto?: PaginationDto): Promise<{users: User[], total: number}> {
        try {
            const { page = 1, limit = 10 } = paginationDto || {};
            const skip = (page - 1) * limit;

            const [users, total] = await this.userRepository.createQueryBuilder('user')
                .where('user.name ILIKE :searchTerm OR user.email ILIKE :searchTerm', {
                    searchTerm: `%${searchTerm}%`
                })
                .skip(skip)
                .take(limit)
                .getManyAndCount();

            return { users, total };
        } catch (error) {
            throw new InternalServerErrorException('Failed to search users');
        }
    }
}