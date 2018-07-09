import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, Column, ManyToMany, JoinTable, AfterLoad } from "typeorm"

import Category from "./category"
import Job from "./job"

@Entity({
    name: "earners"
})
export default class Earner {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "jsonb",
        nullable: true
    })
    categories: Category[]

    @OneToOne((type) => Job, (job) => job.earner)
    @JoinColumn()
    job: Job

    @AfterLoad()
    initCategories() {
        if (!this.categories) {
            this.categories = []
        }
    }

}
