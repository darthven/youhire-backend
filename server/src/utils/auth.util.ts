import * as jwt from "jsonwebtoken"

import env from "../config/env.config"
import User from "../db/entities/user"

export default class AuthUtil {

    public static generateToken(entity: any): string {
        return jwt.sign(Object.assign(entity), env.JWT_SECRET)
    }

    public static decodeToken(token: string): any {
        return jwt.decode(token)
    }
}
