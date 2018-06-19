import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { IsNumberString, IsDateString } from "class-validator"

import PhoneNumber from "./phone-number";

@Entity({
    name: "codes"
})
export default class Code {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsNumberString()
    value: string

    @ManyToOne((type) => PhoneNumber, (phoneNumber) => phoneNumber.codes)
    phoneNumber: PhoneNumber

    @Column({
        name: "created_at"
    })
    @IsDateString()
    createdAt: string

    @Column({
        name: "activated_at",
        nullable: true
    })
    @IsDateString()
    activatedAt: string

}
