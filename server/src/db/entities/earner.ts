import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinColumn } from "typeorm"

import Category from "./category"

@Entity({
    name: "earners"
})
export default class Earner {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToMany((type) => Category, {
        cascade: true
    })
    @JoinColumn()
    category: Category

}
