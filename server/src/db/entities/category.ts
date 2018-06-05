import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({
    name: "categories"
})
export default class Category {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}
