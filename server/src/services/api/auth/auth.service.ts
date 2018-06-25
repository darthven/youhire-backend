import { Service, Inject } from "typedi"
import { InjectRepository } from "typeorm-typedi-extensions"
import { Context } from "koa"
import * as jwt from "jsonwebtoken"

import logger from "../../../config/winston.user"
import env from "../../../config/env.config"
import { SignInConfirmRequest, SignInRequest, Profile, UserDTO, ProfileRequest, AuthUser } from "./auth.dto"
import Code from "../../../db/entities/code"
import CodeRepository from "../code/code.repository"
import PhoneNumberRepository from "../phone-number/phone-number.repository"
import PhoneNumber from "../../../db/entities/phone-number"
import UserRepository from "../users/user.repository"
import User from "../../../db/entities/user"
import Spender from "../../../db/entities/spender"
import Earner from "../../../db/entities/earner"
import Gender from "../../../db/entities/gender"
import EarnerRepository from "../earner/earner.repository"
import SpenderRepository from "../spender/spender.repository"
import GenderRepository from "../gender/gender.repository"
import SMSService from "../sms/sms.service"
import { ValidationError, PhoneNumberNotFoundError,
        InvalidVerificationCodeError, RoleNotFoundError } from "../../../errors/auth.error"
import { UserType } from "../../../common"
import AuthUtil from "../../../utils/auth.util"

@Service()
export default class AuthService {

    @InjectRepository()
    private codeRepository: CodeRepository

    @InjectRepository()
    private phoneNumberRepository: PhoneNumberRepository

    @InjectRepository()
    private genderRepository: GenderRepository

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
            throw new ValidationError()
        }
        return {
            message: "SMS was sent successfully"
        }
    }

    public async confirm(signInConfirmRequest: SignInConfirmRequest, userType: string): Promise<Profile> {
        if (!signInConfirmRequest.phoneNumber || !signInConfirmRequest.code) {
            throw new ValidationError()
        }
        const formattedNumber: string = await this.smsService.formatNumber(signInConfirmRequest.phoneNumber)
        const phoneNumber: PhoneNumber = await this.phoneNumberRepository.findOne({ value: formattedNumber })
        if (!phoneNumber) {
            throw new PhoneNumberNotFoundError()
        }
        const code: Code = await this.codeRepository.findOne({ value: signInConfirmRequest.code })
        if (!code) {
            throw new InvalidVerificationCodeError()
        }
        if (userType === UserType.EARNER) {
            return await this.confirmEarner(phoneNumber)
        } else if (userType === UserType.SPENDER) {
            return await this.confirmSpender(phoneNumber)
        } else {
            throw new RoleNotFoundError(userType)
        }
    }

    public async fillUser(profileRequest: ProfileRequest, currentUser: AuthUser): Promise<UserDTO> {
        const user: User = await this.userRepository.findUserByIdAndPhoneNumber(currentUser.id)
        if (currentUser.type === UserType.EARNER) {
            return new UserDTO(await this.fillUserAsEarner(currentUser.id, profileRequest), currentUser.type)
        }
        return new UserDTO(await this.fillUserAsSpender(currentUser.id, profileRequest), currentUser.type)
    }

    public async getUserProfile(currentUser: AuthUser) {
        const userData: User = await this.userRepository.findUserByIdAndPhoneNumber(currentUser.id)
        return new UserDTO(userData, currentUser.type)
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

    private async createEarner(user: User): Promise<UserDTO> {
        const userData: User = await this.userRepository.findUserAsEarnerById(user.id)
        if (userData && !userData.earner) {
            userData.earner = new Earner()
            const savedUser: User = await this.userRepository.save(userData)
            logger.info("Saved user", JSON.stringify(savedUser, null, 4))
            return {
                ...this.getUserDTO(savedUser, UserType.EARNER)
            }
        }
        return {
            ...this.getUserDTO(userData, UserType.EARNER)
        }
    }

    private async createSpender(user: User): Promise<UserDTO> {
        const userData: User = await this.userRepository.findUserAsSpenderById(user.id)
        if (userData && !userData.spender) {
            userData.spender = new Spender()
            const savedUser: User = await this.userRepository.save(userData)
            logger.info("Saved user", JSON.stringify(savedUser, null, 4))
            return {
                ...this.getUserDTO(savedUser, UserType.SPENDER),
            }
        }
        return {
            ...this.getUserDTO(user, UserType.SPENDER),
        }
    }

    private async confirmEarner(phoneNumber: PhoneNumber) {
        const user: User = await this.userRepository.findUserAsEarnerByPhoneNumber(phoneNumber)
            || await this.createUserWithoutRole(phoneNumber)
        const userEarner: UserDTO = await this.createEarner(user)
        return {
            status: "Success",
            token: AuthUtil.generateToken({ id: userEarner.id,
                phoneNumber: userEarner.phoneNumber,
                type: userEarner.type
            }),
            info: userEarner
        }
    }

    private async confirmSpender(phoneNumber: PhoneNumber) {
        const user: User = await this.userRepository.findUserAsSpenderByPhoneNumber(phoneNumber)
            || await this.createUserWithoutRole(phoneNumber)
        const userSpender: UserDTO = await this.createSpender(user)
        return {
            status: "Success",
            token: AuthUtil.generateToken({ id: userSpender.id,
                phoneNumber: userSpender.phoneNumber,
                type: userSpender.type
            }),
            info: userSpender
        }
    }

    private async fillUserGeneralData(user: User, profileRequest: ProfileRequest): Promise<User> {
        const gender: Gender = await this.genderRepository.findOne({ type: profileRequest.gender})
        const phoneNumber: PhoneNumber = await this.phoneNumberRepository.save({
            value: profileRequest.phoneNumber,
            createdAt: new Date().toISOString()
        } as PhoneNumber)
        user.phoneNumber = phoneNumber
        user.gender = gender
        user.numbersHistory.push(user.phoneNumber)
        user.firstName = profileRequest.firstName
        user.lastName = profileRequest.lastName
        user.firstName = profileRequest.firstName
        user.email = profileRequest.email
        user.age = profileRequest.age
        user.birthDate = profileRequest.birthDate
        return user
    }

    private async fillUserAsEarner(userId: number, profileRequest: ProfileRequest): Promise<User> {
        const user: User = await this.userRepository.findUserAsEarnerById(userId)
        await this.fillUserGeneralData(user, profileRequest)
        // user.earner.category = profileRequest.category
        // await this.earnerRepository.save(user.earner)
        return this.userRepository.save(user)
    }

    private async fillUserAsSpender(userId: number, profileRequest: ProfileRequest): Promise<User> {
        const user: User = await this.userRepository.findUserAsSpenderById(userId)
        this.fillUserGeneralData(user, profileRequest)
        return this.userRepository.save(user)
    }
}
