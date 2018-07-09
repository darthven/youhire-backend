import { Param, Body, Get, Post, Put, JsonController, HttpCode,
    Authorized, CurrentUser, HeaderParam } from "routing-controllers"
import { Inject } from "typedi"

import AuthService from "./auth.service"
import { SignInConfirmRequest, SignInRequest, ProfileRequest, AuthUser } from "./auth.dto"

@JsonController("/api/user")
export class AuthController {

    @Inject()
    private readonly authService: AuthService

    @HttpCode(201)
    @Post("/send")
    public async sendMessage(@Body() request: SignInRequest, @HeaderParam("Accept-Language") locale) {
        return await this.authService.send(request)
    }

    @HttpCode(201)
    @Post("/auth/:type")
    public async verifyConfirmationCode(@Param("type") userType: string,
                                        @Body() request: SignInConfirmRequest) {
        return await this.authService.confirm(request, userType)
    }

    @Authorized()
    @HttpCode(200)
    @Put("/profile")
    public async fillUserProfile(@Body() request: ProfileRequest, @CurrentUser({required: true}) user: AuthUser) {
        return await this.authService.fillUser(request, user)
    }

    @Authorized()
    @HttpCode(200)
    @Get("/profile")
    public async getProfile(@CurrentUser({required: true}) user: AuthUser) {
       return await this.authService.getUserProfile(user)
    }
}
