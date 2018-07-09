import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, Tree, TreeParent, TreeChildren, AfterLoad } from "typeorm"

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
        nullable: true,
        type: "float"
    })
    minPrice: number

    @Column({
        nullable: true,
        type: "float"
    })
    maxPrice: number

    @TreeParent()
    parentCategory: Category

    @TreeChildren()
    subcategories: Category[]

    certificate?: string

    selected: boolean = false

}
