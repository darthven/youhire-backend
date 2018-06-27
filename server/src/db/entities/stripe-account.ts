import { Entity, PrimaryGeneratedColumn, OneToOne, Column } from "typeorm"

import Spender from "./spender"

@Entity()
export default class StripeAccount {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    stripeId: string

    @OneToOne((type) => Spender, (spender) => spender.stripeAccount)
    spender: Spender

}
