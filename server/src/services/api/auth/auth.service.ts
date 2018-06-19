import { Service, Inject } from "typedi"
import { InjectRepository } from "typeorm-typedi-extensions"
import { HttpError } from "routing-controllers"

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
import EarnerRepository from "../earner/earner.repository"
import SpenderRepository from "../spender/spender.repository"
import SMSService from "../sms/sms.service"

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

    @Inject()
    private smsService: SMSService

    public async send(signInRequest: SignInRequest): Promise<{ message: string }> {
        const formattedNumber: string = await this.smsService.formatNumber(signInRequest.phoneNumber)
        const savedNumber: PhoneNumber = await this.savePhoneNumber(formattedNumber)
        const savedCode: Code = await this.saveVerificationCode(savedNumber)
        try {
            await this.smsService.sendSMS(signInRequest, savedCode)
        } catch (err) {
            throw new HttpError(400, err.error.message)
        }
        return {
            message: "SMS was sent successfully"
        }
    }

    public async confirm(signInConfirmRequest: SignInConfirmRequest, userType: string): Promise<Profile> {
        const formattedNumber: string = await this.smsService.formatNumber(signInConfirmRequest.phoneNumber)
        const phoneNumber: PhoneNumber = await this.phoneNumberRepository.findOne({ value: formattedNumber })
        const code: Code = await this.codeRepository.findOne({ value: signInConfirmRequest.code })
        const user: User = await this.userRepository.findUserByPhoneNumberAndRole(phoneNumber, userType)
            || await this.createUserWithoutRole(phoneNumber)
        logger.info("Extracted user", JSON.stringify(user, null, 4))
        if (userType === "earner") {
            const userEarner: EarnerDTO = await this.confirmEarner(user, userType)
            return {
                status: "Success",
                token: this.generateToken(),
                profile: userEarner
            }
        } else if (userType === "spender") {
            const userSpender: SpenderDTO = await this.confirmSpender(user, userType)
            return {
                status: "Success",
                token: this.generateToken(),
                profile: userSpender
            }
        } else {
            throw new HttpError(404, `Role ${userType} is not supported`)
        }
    }

    public async verifyCode(req: SignInConfirmRequest) {
        return null
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
        code.createdAt = new Date().toISOString()
        code.phoneNumber = phoneNumber
        return await this.codeRepository.save(code)
    }

    private generateToken(): string {
        return "asdasd"
    }

    private generateCode(from: number, to: number): string {
        return "12345"
    }

    private async createUserWithoutRole(phoneNumber: PhoneNumber): Promise<User> {
        const newUser = new User()
        newUser.phoneNumber = phoneNumber
        newUser.numbersHistory = [phoneNumber]
        return await this.userRepository.save(newUser)
    }

    private getUserDTO(user: User, type: string): UserDTO {
        const { id, phoneNumber, gender, firstName, lastName, email, birthDate, age } = user
        return new UserDTO(user, type)
    }

    private async confirmEarner(user: User, type: string): Promise<EarnerDTO> {
        const userData: User = await this.userRepository.findUserByRoleAndId(user.id, type)
        if (userData && !userData.earner) {
            userData.earner = new Earner()
            const savedUser: User = await this.userRepository.save(userData)
            logger.info("Saved user", JSON.stringify(savedUser, null, 4))
            return {
                ...this.getUserDTO(savedUser, type),
                category: savedUser.earner.category
            }
        }
        return {
            ...this.getUserDTO(user, type),
            category: user.earner.category
        }
    }

    private async confirmSpender(user: User, type: string): Promise<SpenderDTO> {
        const userData: User = await this.userRepository.findUserByRoleAndId(user.id, type)
        if (userData && !userData.spender) {
            userData.spender = new Spender()
            const savedUser: User = await this.userRepository.save(userData)
            logger.info("Saved user", JSON.stringify(savedUser, null, 4))
            return {
                ...this.getUserDTO(savedUser, type),
                creditData: "stubData"
            }
        }
        return {
            ...this.getUserDTO(user, type),
            creditData: "Credit Data"
        }
    }
}
