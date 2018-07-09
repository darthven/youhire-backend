import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"

import Earner from "./earner"
import Spender from "./spender"
import Category from "./category"
import JobLocation from "./job-location"

@Entity()
export default class Job {

    @PrimaryGeneratedColumn()
    id: number

    @Column((type) => JobLocation)
    address: JobLocation

    @Column()
    status: boolean

    @Column()
    details: string

    @Column({
        nullable: true
    })
    addition: string

    @Column()
    percentageActivity: number

    @OneToOne((type) => Category)
    category: Category

    @OneToOne((type) => Earner, (earner) => earner.job, {
        cascade: true
    })
    earner: Earner

    @OneToOne((type) => Spender, (spender) => spender.job, {
        cascade: true
    })
    spender: Spender

}
