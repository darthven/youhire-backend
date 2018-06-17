import { Repository, UpdateResult, DeleteResult } from "typeorm"
import { Service } from "typedi"
import { InjectRepository } from "typeorm-typedi-extensions"

import User from "../../../db/entities/user"
import UserRepository from "./user.repository";

@Service()
export default class UserService {

    @InjectRepository()
    private repository: UserRepository

    public async createUser(user: User): Promise<User> {
        return await this.repository.save(user)
    }

    public async updateUser(id: number, user: User): Promise<UpdateResult> {
        return await this.repository.update(id, user)
    }

    public async findUserById(id: number): Promise<User> {
        return await this.repository.findOne(id)
    }

    public async findAllUsers(): Promise<User[]> {
        return await this.repository.find()
    }

    public async deleteUser(id: number): Promise<DeleteResult> {
        return await this.repository.delete(id)
    }

    public async clearUsers(): Promise<void> {
        return await this.repository.clear()
    }

}
