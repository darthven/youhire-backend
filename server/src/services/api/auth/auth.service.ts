import { Service, Inject } from "typedi"
import { InjectRepository } from "typeorm-typedi-extensions"

import logger from "../../../config/winston.user"
import { SignInConfirmRequest, SignInRequest, Profile, UserDTO,
        ProfileRequest, AuthUser, CategoryDTO } from "./auth.dto"
import Code from "../../../db/entities/code"
import CodeRepository from "../code/code.repository"
import PhoneNumberRepository from "../phone-number/phone-number.repository"
import PhoneNumber from "../../../db/entities/phone-number"
import UserRepository from "../users/user.repository"
import User from "../../../db/entities/user"
import Spender from "../../../db/entities/spender"
import Earner from "../../../db/entities/earner"
import Gender from "../../../db/entities/gender"
import Category from "../../../db/entities/category"
import CategoryRepository from "../category/category.repository"
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

    @InjectRepository()
    private categoryRepository: CategoryRepository

    @Inject()
    private smsService: SMSService

    public async send(signInRequest: SignInRequest): Promise<{ message: string }> {
        const formattedNumber: string = await this.smsService.formatNumber(signInRequest.phoneNumber)
        const savedNumber: PhoneNumber =  await this.phoneNumberRepository.findOne({ value: formattedNumber})
                                    || await this.savePhoneNumber(formattedNumber)
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
            return await this.confirmEarner(phoneNumber, code)
        } else if (userType === UserType.SPENDER) {
            return await this.confirmSpender(phoneNumber, code)
        } else {
            throw new RoleNotFoundError(userType)
        }
    }

    public async fillUser(profileRequest: ProfileRequest, currentUser: AuthUser): Promise<UserDTO> {
        const user: User = await this.userRepository
            .findUserByIdAndPhoneNumberAndType(currentUser.id, currentUser.type as UserType)
        if (currentUser.type === UserType.EARNER) {
            return new UserDTO(await this.fillUserAsEarner(currentUser.id, profileRequest), currentUser.type)
        }
        return new UserDTO(await this.fillUserAsSpender(currentUser.id, profileRequest), currentUser.type)
    }

    public async getUserProfile(currentUser: AuthUser): Promise<UserDTO> {
        const userData: User = await this.userRepository
            .findUserByIdAndPhoneNumberAndType(currentUser.id, currentUser.type as UserType)
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
        code.value = this.generateCode(6)
        code.createdAt = new Date().toISOString()
        code.phoneNumber = phoneNumber
        return await this.codeRepository.save(code)
    }

    private generateCode(length: number): string {
        return AuthUtil.generateVerificationCode(length)
    }

    private async createUserWithoutRole(phoneNumber: PhoneNumber): Promise<User> {
        const newUser = new User()
        newUser.phoneNumber = phoneNumber
        newUser.numbersHistory = [phoneNumber]
        return await this.userRepository.save(newUser)
    }

    private getUserDTO(user: User, type: string): UserDTO {
        return new UserDTO(user, type)
    }

    private async createEarner(user: User): Promise<UserDTO> {
        const userData: User = await this.userRepository.findUserAsEarnerById(user.id)
        if (userData && !userData.earner) {
            userData.earner = new Earner()
            userData.earner.categories = await this.categoryRepository.findAllCategoriesWithSubcategories()
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

    private async confirmEarner(phoneNumber: PhoneNumber, code: Code) {
        const user: User = await this.userRepository.findUserAsEarnerByPhoneNumber(phoneNumber)
            || await this.createUserWithoutRole(phoneNumber)
        const userEarner: UserDTO = await this.createEarner(user)
        code.activatedAt = new Date().toISOString()
        const savedCode = await this.codeRepository.save(code)
        phoneNumber.codes = [code]
        await this.phoneNumberRepository.save(phoneNumber)
        return {
            status: "Success",
            token: AuthUtil.generateToken({ id: userEarner.id,
                phoneNumber: userEarner.phoneNumber,
                type: userEarner.type
            }),
            info: userEarner
        }
    }

    private async confirmSpender(phoneNumber: PhoneNumber, code: Code) {
        const user: User = await this.userRepository.findUserAsSpenderByPhoneNumber(phoneNumber)
            || await this.createUserWithoutRole(phoneNumber)
        const userSpender: UserDTO = await this.createSpender(user)
        code.activatedAt = new Date().toISOString()
        await this.codeRepository.save(code)
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
        user.gender = gender
        user.firstName = profileRequest.firstName
        user.lastName = profileRequest.lastName
        user.firstName = profileRequest.firstName
        user.email = profileRequest.email
        user.age = profileRequest.age
        user.birthDate = profileRequest.birthDate
        if (profileRequest.category && user.earner) {
            user.earner = await this.handleCategories(profileRequest.category, user.earner)
        }
        return this.updatePhoneNumber(user, profileRequest.phoneNumber)
    }

    private async updatePhoneNumber(user: User, value: string): Promise<User> {
        const phoneNumber: PhoneNumber = await this.phoneNumberRepository.findOne({ value })
        if (!phoneNumber) {
            user.phoneNumber = await this.phoneNumberRepository.save({
                value,
                createdAt: new Date().toISOString()
            } as PhoneNumber)
            user.numbersHistory.push(phoneNumber)
        }
        return user
    }

    private async fillUserAsEarner(userId: number, profileRequest: ProfileRequest): Promise<User> {
        const user: User = await this.userRepository.findUserAsEarnerById(userId)
        await this.fillUserGeneralData(user, profileRequest)
        return this.userRepository.save(user)
    }

    private async fillUserAsSpender(userId: number, profileRequest: ProfileRequest): Promise<User> {
        const user: User = await this.userRepository.findUserAsSpenderById(userId)
        this.fillUserGeneralData(user, profileRequest)
        return this.userRepository.save(user)
    }

    private async handleCategories(categoryDTO: CategoryDTO, earner: Earner): Promise<Earner> {
        const category: Category = (await this.categoryRepository.findRoots())
            .find((cat) => cat.name === categoryDTO.name)
        category.subcategories = (await this.categoryRepository.findDescendants(category))
            .filter((cat) => categoryDTO.subcategories.map((subCat) => subCat.name).includes(cat.name))
        if (earner.categories.length > 0) {
            earner.categories = earner.categories.map((cat) => this.selectCategory(cat, false))
        }
        earner.categories = [this.selectCategory(category, true)]
        return earner
    }

    private selectCategory(category: Category, status: boolean): Category {
        const selectedCategory: Category = category
        const subcategories: Category[] = selectedCategory.subcategories
        selectedCategory.selected = status
        if (subcategories) {
            selectedCategory.subcategories = subcategories.map((subCategory) => {
                return {
                    ...subCategory,
                    selected: status
                }
            })
        }
        return selectedCategory
    }
}
