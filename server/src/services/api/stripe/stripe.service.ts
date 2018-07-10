import { Service } from "typedi"
import { InjectRepository } from "typeorm-typedi-extensions"
import * as Stripe from "stripe"
import { isNullOrUndefined } from "util"

import envConfig from "../../../config/env.config"
import UserRepository from "../users/user.repository"
import SpenderRepository from "../spender/spender.repository"
import StripeRepository from "./stripe.repository"
import Spender from "../../../db/entities/spender"
import User from "../../../db/entities/user"
import StripeAccount from "../../../db/entities/stripe-account"

@Service()
export default class StripeService {

    @InjectRepository()
    private userRepository: UserRepository

    @InjectRepository()
    private spenderRepository: SpenderRepository

    @InjectRepository()
    private stripeRepository: StripeRepository

    private readonly stripeAPI = new Stripe(envConfig.STRIPE_API_KEY)

    /**
     * TODO remove before release
     */
    public async findAllAccounts(): Promise<StripeAccount[]> {
        return await this.stripeRepository.find()
    }

    public async createCustomer(userId: number, token: string): Promise<Spender> {
        const userData: User = await this.userRepository.findUserAsSpenderById(userId)
        const spenderData: Spender = userData.spender
        const stripeAccount: StripeAccount = await this.extractStripeAccountFromUser(userData)
            || await this.createStripeAccount(userData, token)
        await this.stripeRepository.save(stripeAccount)
        spenderData.stripeAccount = stripeAccount
        return await this.spenderRepository.save(spenderData)
    }

    public async createCard(userId: number, token: string): Promise<StripeAccount> {
        const userData: User = await this.userRepository.findUserAsSpenderById(userId)
        const stripeAccount = await this.extractStripeAccountFromUser(userData)
        await this.stripeAPI.customers.createSource(stripeAccount.stripeId,
            {
                source: token
            })
        const updatedCustomer: Stripe.customers.ICustomer =
            await this.stripeAPI.customers.retrieve(stripeAccount.stripeId)
        return await this.stripeRepository.save(stripeAccount)
    }

    public async deleteCard(userId: number, token: string): Promise<StripeAccount> {
        const userData: User = await this.userRepository.findUserAsSpenderById(userId)
        const stripeAccount = await this.extractStripeAccountFromUser(userData)
        await this.stripeAPI.customers.deleteSource(stripeAccount.stripeId, token)
        const updatedCustomer: Stripe.customers.ICustomer =
            await this.stripeAPI.customers.retrieve(stripeAccount.stripeId)
        return await this.stripeRepository.save(stripeAccount)
    }

    private async createStripeAccount(user: User, token: string): Promise<StripeAccount> {
        const userData: User = await this.userRepository.findUserAsSpenderById(user.id)
        const stripeAccount = new StripeAccount()
        const customer: Stripe.customers.ICustomer = await this.stripeAPI.customers.create({
            source: token,
            email: userData.email
        })
        stripeAccount.stripeId = customer.id
        return await this.stripeRepository.save(stripeAccount)
    }

    private async extractStripeAccountFromUser(user: User): Promise<StripeAccount> {
        return (await this.spenderRepository.findSpenderByIdAndStripeAccount(user.spender.id)).stripeAccount
    }

    private async retrieveCustomer(accountId: string): Promise<any> {
        return await this.stripeAPI.customers.retrieve(accountId)
    }
}
