import * as jwt from "jsonwebtoken"
import * as random from "randomstring"

import env from "../config/env.config"

export default class AuthUtil {

    public static generateToken(entity: any): string {
        return jwt.sign(Object.assign(entity), env.JWT_SECRET)
    }

    public static decodeToken(token: string): any {
        return jwt.decode(token)
    }

    public static generateVerificationCode(): string {
        return env.SMS_TEXT.replace(new RegExp("{{[\\s]*code[\\s]*}}", "g"), random.generate({
           length: env.CODE_LEN as number,
           charset: "numeric"
        }))
    }
 }
