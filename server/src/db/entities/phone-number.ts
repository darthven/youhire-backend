import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from "typeorm"
import { IsString, IsDateString } from "class-validator"

import User from "./user";
import Code from "./code";

@Entity({
    name: "numbers"
})
export default class PhoneNumber {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsString()
    value: string

    @Column({
        name: "created_at"
    })
    @IsDateString()
    createdAt: string

    @OneToOne((type) => User)
    @JoinColumn()
    user: User

    @OneToMany((type) => Code, (code) => code.phoneNumber)
    codes: Code[]
}
