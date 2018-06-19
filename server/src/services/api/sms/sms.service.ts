import { Service } from "typedi"

import * as request from "request-promise-native"
import env from "../../../config/env.config"
import { SignInRequest } from "../auth/auth.dto"
import Code from "../../../db/entities/code"

@Service()
export default class SMSService {

    private readonly twillioAppUrl: string = `http://${env.SMS_APP_HOST}:${env.SMS_APP_PORT}`

    public async formatNumber(phoneNumber: string) {
        const res = await request.post({
            url: `${this.twillioAppUrl}/api/number/format`,
            body: { phoneNumber },
            json: true
        })
        return res.phoneNumber
    }

    public async sendSMS(signInRequest: SignInRequest, code: Code) {
        return await request.post({
            url: `${this.twillioAppUrl}/api/sms/send`,
            body: {
                ...signInRequest,
                text: code.value
            },
            json: true
        })
    }
}
