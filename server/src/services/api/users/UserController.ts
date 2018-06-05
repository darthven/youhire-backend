import { Context } from "koa"
import { getManager, Repository } from "typeorm"

import User from "../../../db/entities/user"
import logger from "../../../config/winston.user"
import { validate, ValidationError } from "class-validator"

const saveUser = async (context: Context): Promise<void> => {
    const user: User = Object.assign(new User(), context.request.body)
    return await validate(user).then(async (errors: ValidationError[]) => {
        if (errors.length > 0) {
            context.status = 400
            context.body = {
                message: `Validation Errors: ${errors}`
            }
        } else {
            const userRepository: Repository<User> = getManager().getRepository(User)
            const newUser: User = userRepository.create(user)
            await userRepository.save(newUser)
            context.body = newUser
        }
    })
}

const getUserById = async (context: Context): Promise<User> => {
    const userRepository: Repository<User> = getManager().getRepository(User)
    const user: User = await userRepository.findOne((context as any).params.id)
    if (!user) {
        context.status = 404
        return
    }
    context.body = user
}

export { saveUser, getUserById }
