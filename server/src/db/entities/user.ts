import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne, JoinColumn } from "typeorm"
import { IsInt, IsEmail, IsDate, Min, Max, MinLength, MaxLength, IsString, IsAlpha, IsNotEmpty} from "class-validator"

import Gender from "./gender"
import Spender from "./spender"
import Earner from "./earner"

@Entity({
    name: "users"
})
export default class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsAlpha({ message: "Only alphabetic characters can be used"})
    @MinLength(3, { message: "Minimum length is 3" })
    @MaxLength(20, { message: "Maximum length is 20" })
    firstName: string

    @Column()
    @IsAlpha()
    @MinLength(3)
    @MaxLength(20)
    lastName: string

    @Column()
    @IsInt()
    @Min(16)
    @Max(100)
    age: number

    @Column()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @Column()
    @IsDate()
    @IsNotEmpty()
    birthDate: Date

    @OneToOne((type) => Gender)
    @JoinColumn()
    gender: Gender

    @OneToOne((type) => Gender)
    @JoinColumn()
    earner: Earner

    @OneToOne((type) => Gender)
    @JoinColumn()
    spender: Spender

}
