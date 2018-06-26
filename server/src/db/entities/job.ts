import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"

import Earner from "./earner"
import Spender from "./spender"

@Entity()
export default class Job {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    address: string

    @Column()
    cost: number

    @Column()
    status: boolean

    @Column()
    percentageActivity: number

    @OneToOne((type) => Earner, (earner) => earner.job)
    earner: Earner

    @OneToOne((type) => Spender, (spender) => spender.job)
    spender: Spender

}
