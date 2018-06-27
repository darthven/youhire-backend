import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, Tree, TreeParent, TreeChildren } from "typeorm"

@Entity({
    name: "categories"
})
@Tree("closure-table")
export default class Category {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({
        nullable: true
    })
    certificate: string

    @Column({
        nullable: true,
        type: "float"
    })
    price: number

    @TreeParent()
    parentCategory: Category

    @TreeChildren()
    subcategories: Category[]
}
