import { DeleteResult, UpdateEvent, UpdateResult } from "typeorm";
import { Param, Body, Get, Post, Put, Delete, JsonController, HttpCode } from "routing-controllers"
import { Inject } from "typedi"

import User from "../../../db/entities/user"
import UserService from "./user.service"

@JsonController("/users")
export class UserController {

    @Inject()
    private readonly service: UserService

    @HttpCode(200)
    @Get()
    public async getAllUsers(): Promise<User[]> {
       return await this.service.findAllUsers().then((users) => users).catch((err) => err)
    }

    @HttpCode(200)
    @Get("/:id")
    public async getUser(@Param("id") id: number): Promise<User> {
        return await this.service.findUserById(id).then((user) => user).catch((err) => err)
    }

    @HttpCode(200)
    @Post()
    public async createUser(@Body() user: User): Promise<User> {
        return await this.service.createUser(user).then((res) => res).catch((err) => err)
    }

    @HttpCode(200)
    @Put("/:id")
    public async updateUser(@Param("id") id: number, @Body() user: User): Promise<UpdateResult> {
       return await this.service.updateUser(id, user).then((res) => res).catch((err) => err)
    }

    @HttpCode(200)
    @Delete("/:id")
    public async removeUser(@Param("id") id: number): Promise<DeleteResult> {
       return await this.service.deleteUser(id).then((res) => res).catch((err) => err)
    }

    @HttpCode(200)
    @Delete()
    public async clearUsers(): Promise<DeleteResult> {
        return await this.service.clearUsers().then(() => null).catch((err) => err)
    }
}
