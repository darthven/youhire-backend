import { Repository, UpdateResult, DeleteResult } from "typeorm"
import { Service } from "typedi"
import { InjectRepository } from "typeorm-typedi-extensions"

import User from "../../../db/entities/user"
import UserRepository from "./user.repository";

@Service()
export default class UserService {

    @InjectRepository()
    private repository: UserRepository

    public async userExist(user: User): Promise<boolean> {
        return await this.repository.findByPhoneNumber(user.email) ? true : false;
    }

    async createUser(user: User): Promise<User> {
        return await this.repository.save(user)
    }

    async updateUser(id: number, user: User): Promise<UpdateResult> {
        return await this.repository.update(id, user)
    }

    async findUserById(id: number): Promise<User> {
        return await this.repository.findOne(id)
    }

    async findAllUsers(): Promise<User[]> {
        return await this.repository.find()
    }

    async deleteUser(id: number): Promise<DeleteResult> {
        return await this.repository.delete(id)
    }

    async clearUsers(): Promise<void> {
        return await this.repository.clear()
    }

}
