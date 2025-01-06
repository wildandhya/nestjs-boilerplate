import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";


@Injectable()
export class UserService {
    constructor(
        @Inject("USER_REPOSITORY")
        private userRepository: Repository<User>
    ) { }

    async FindAll(): Promise<User[]> {
        return this.userRepository.find()
    }

    async FindOne(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email: email } })
    }
}