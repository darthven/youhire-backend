import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"

import Job from "./job"
import StripeAccount from "./stripe-account"

@Entity({
    name: "spenders"
})
export default class Spender {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne((type) => Job, (job) => job.spender)
    @JoinColumn()
    job: Job

    @OneToOne((type) => StripeAccount, (stripeAccount) => stripeAccount.spender)
    @JoinColumn()
    stripeAccount: StripeAccount

}
