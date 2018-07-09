import { JsonController, HttpCode, Post, Authorized, CurrentUser, Get, Body } from "routing-controllers"
import { Inject } from "typedi"

import StripeService from "./stripe.service"
import User from "../../../db/entities/user"
import Spender from "../../../db/entities/spender"
import StripeAccount from "../../../db/entities/stripe-account"
import { CreateCustomerRequest } from "./stripe.dto"

@JsonController("/stripe")
export class StripeController {

    @Inject()
    private service: StripeService

    @Authorized()
    @HttpCode(201)
    @Post("/account")
    public async createCustomerAccount(@CurrentUser({ required: true }) user: User,
                                       @Body() request: CreateCustomerRequest): Promise<Spender> {
        return await this.service.createCustomer(user.id, request.token)
    }

    @HttpCode(200)
    @Get("/account")
    public async getAllAccounts(): Promise<StripeAccount[]> {
        return await this.service.findAllAccounts()
    }
}
