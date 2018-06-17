import { DeleteResult, UpdateEvent, UpdateResult } from "typeorm";
import { Param, Body, Get, Post, Put, Delete, JsonController, HttpCode, HttpError } from "routing-controllers"
import { Inject } from "typedi"

import AuthService from "./auth.service"
import { SignInConfirmRequest, SignInRequest } from "./auth.dto"

@JsonController("/api/user")
export class AuthController {

    @Inject()
    private readonly authService: AuthService

    @HttpCode(201)
    @Post("/send")
    public async sendMessage(@Body() request: SignInRequest) {
        return await this.authService.send(request)
    }

    @HttpCode(201)
    @Post("/auth/:type")
    public async verifyConfirmationCode(@Param("type") userType: string,
                                        @Body() request: SignInConfirmRequest) {
        return await this.authService.confirm(request, userType)
    }

    @HttpCode(200)
    @Get("/profile")
    public async getProfile() {
       return await null
    }
}
