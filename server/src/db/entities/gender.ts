import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({
    name: "genders"
})
export default class Gender {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

}
