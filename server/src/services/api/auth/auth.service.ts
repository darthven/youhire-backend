import { Service, Inject } from "typedi"
import * as request from "request-promise-native"
import { InjectRepository } from "typeorm-typedi-extensions"
import { HttpError } from "routing-controllers"

import env from "../../../config/env.config"
import logger from "../../../config/winston.user"
import { SignInConfirmRequest, SignInRequest, Profile, EarnerDTO, SpenderDTO, UserDTO } from "./auth.dto"
import Code from "../../../db/entities/code"
import CodeRepository from "../code/code.repository"
import PhoneNumberRepository from "../phone-number/phone-number.repository"
import PhoneNumber from "../../../db/entities/phone-number"
import UserRepository from "../users/user.repository"
import User from "../../../db/entities/user"
import Spender from "../../../db/entities/spender"
import Earner from "../../../db/entities/earner"
import EarnerRepository from "../earner/earner.repository";
import SpenderRepository from "../spender/spender.repository";

@Service()
export default class AuthService {

    @InjectRepository()
    private codeRepository: CodeRepository

    @InjectRepository()
    private phoneNumberRepository: PhoneNumberRepository

    @InjectRepository()
    private userRepository: UserRepository

    @InjectRepository()
    private earnerRepository: EarnerRepository

    @InjectRepository()
    private spenderRepository: SpenderRepository

    private readonly twillioAppUrl: string = `http://${env.SMS_APP_HOST}:${env.SMS_APP_PORT}`

    public async send(signInRequest: SignInRequest): Promise<{ message: string }> {
        const formattedNumber: string = await this.formatNumber(signInRequest.phoneNumber)
        const savedNumber: PhoneNumber = await this.savePhoneNumber(formattedNumber)
        const savedCode: Code = await this.saveVerificationCode(savedNumber)
        try {
            await this.sendSMS(signInRequest, savedCode)
        } catch (err) {
            throw new HttpError(400, err.error.message)
        }
        return {
            message: "SMS was sent successfully"
        }
    }

    public async confirm(signInConfirmRequest: SignInConfirmRequest, userType: string): Promise<Profile> {
        const formattedNumber: string = await this.formatNumber(signInConfirmRequest.phoneNumber)
        const phoneNumber: PhoneNumber = await this.phoneNumberRepository.findOne({ value: formattedNumber})
        const code: Code = await this.codeRepository.findOne({ value: signInConfirmRequest.code })
        const user: User = await this.userRepository.findOne({ phoneNumber })
                            || this.createUserWithoutRole(code, phoneNumber)
        logger.info("Extracted user", user)
        if (userType === "earner") {
            const userEarner: EarnerDTO = await this.confirmEarner(user, userType)
            logger.info(`${JSON.stringify(userEarner, null, 4)}`)
            return {
                status: "Success",
                token: this.generateToken(),
                profile: userEarner
            }
        } else if (userType === "spender") {
            const userSpender: SpenderDTO = await this.confirmSpender(user, userType)
            logger.info(`${JSON.stringify(userSpender, null, 4)}`)
            return {
                status: "Success",
                token: this.generateToken(),
                profile: userSpender
            }
        } else {
            throw new HttpError(404, `Role ${userType} is not supported`)
        }
    }

    public async signIn(signInRequest: SignInRequest) {
        return null
    }

    public async register(signInRequest: SignInRequest) {
        return null
    }

    public async createUser(req: SignInConfirmRequest) {
        return null
    }

    public async verifyCode(req: SignInConfirmRequest) {
        return null
    }

    private async formatNumber(phoneNumber: string): Promise<string> {
        const res = await request.post({
            url: `${this.twillioAppUrl}/api/number/format`,
            body: { phoneNumber },
            json: true
        })
        return res.phoneNumber
    }

    private async savePhoneNumber(value: string): Promise<PhoneNumber> {
        const phoneNumber = new PhoneNumber()
        phoneNumber.value = value
        phoneNumber.createdAt = new Date().toISOString()
        return await this.phoneNumberRepository.save(phoneNumber)
    }

    private async saveVerificationCode(phoneNumber: PhoneNumber): Promise<Code> {
        const code = new Code()
        code.value = this.generateCode(0, 9)
        code.phoneNumber = phoneNumber
        code.createdAt = new Date().toISOString()
        return await this.codeRepository.save(code)
    }

    private async sendSMS(signInRequest: SignInRequest, code: Code): Promise<any> {
        return await request.post({
            url: `${this.twillioAppUrl}/api/sms/send`,
            body: {
                ...signInRequest,
                text: code.value
            },
            json: true
        })
    }

    private generateToken(): string {
        return "asdasd"
    }

    private generateCode(from: number, to: number): string {
        return "12345"
    }

    private createUserWithoutRole(code: Code, phoneNumber: PhoneNumber): User {
        const newUser = new User()
        newUser.phoneNumber = phoneNumber
        newUser.numbersHistory = [phoneNumber]
        return newUser
    }

    private getUserDTO(user: User, type: string): UserDTO {
        const { id, phoneNumber, numbersHistory, gender,
            firstName, lastName, email, birthDate, age } = user
        return {
            id,
            type,
            phoneNumber: phoneNumber.value,
            numbersHistory: numbersHistory.map((num) => num.value),
            gender: (gender) ? gender.genderType : null,
            firstName,
            lastName,
            email,
            birthDate,
            age
        }
    }

    private async confirmEarner(user: User, type: string): Promise<EarnerDTO> {
        const earner: Earner = await this.earnerRepository.findOne({})
        if (!earner) {
            user.earner = await this.earnerRepository.save(new Earner())
            const savedUser: User = await this.userRepository.save(user)
            logger.info("Saved user", savedUser)
            return {
                ...this.getUserDTO(savedUser, type),
                category: savedUser.earner.category
            }
        }
        return {
            ...this.getUserDTO(user, type),
            category: earner.category
        }
    }

    private async confirmSpender(user: User, type: string): Promise<SpenderDTO> {
        const spender: Spender = await this.spenderRepository.findOne({})
        if (!spender) {
            user.spender = new Spender()
            const savedUser: User = await this.userRepository.save(user)
            logger.info("Saved user", savedUser)
            return {
                ...this.getUserDTO(savedUser, type),
                creditData: "Credit Data"
            }
        }
        return {
            ...this.getUserDTO(user, type),
            creditData: "Credit Data"
        }
    }
}
