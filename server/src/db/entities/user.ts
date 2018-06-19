import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { IsInt, IsEmail, IsDate, Min, Max, MinLength, MaxLength,
    IsString, IsAlpha, IsNotEmpty, IsDateString, IsMobilePhone, IsNumberString, IsArray, IsEmpty} from "class-validator"

import Gender from "./gender"
import Spender from "./spender"
import Earner from "./earner"
import Code from "./code";
import PhoneNumber from "./phone-number";

@Entity({
    name: "users"
})
export default class User {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne((type) => PhoneNumber, {
        cascade: true
    })
    @JoinColumn({
        name: "phone_number_id"
    })
    phoneNumber: PhoneNumber

    @ManyToMany((type) => PhoneNumber)
    @JoinTable({
        name: "numbers_history"
    })
    numbersHistory: PhoneNumber[]

    @Column({
        nullable: true
    })
    @IsAlpha()
    @MinLength(3)
    @MaxLength(20)
    firstName: string

    @Column({
        nullable: true
    })
    @IsAlpha()
    @MinLength(3)
    @MaxLength(20)
    lastName: string

    @Column({
        nullable: true
    })
    @IsInt()
    @Min(16)
    @Max(100)
    age: number

    @Column({
        nullable: true
    })
    @IsEmail()
    email: string

    @Column({
        nullable: true
    })
    @IsDateString()
    birthDate: Date

    @OneToOne((type) => Gender, {
        cascade: true
    })
    @JoinColumn({
        name: "gender_id"
    })
    gender: Gender

    @OneToOne((type) => Earner, {
        cascade: true
    })
    @JoinColumn({
        name: "earner_id"
    })
    earner: Earner

    @OneToOne((type) => Spender, {
        cascade: true
    })
    @JoinColumn({
        name: "spender_id"
    })
    spender: Spender

}
