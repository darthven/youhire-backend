import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinColumn, OneToOne } from "typeorm"

import Category from "./category"
import Job from "./job"

@Entity({
    name: "earners"
})
export default class Earner {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToMany((type) => Category)
    @JoinColumn()
    category: Category

    @OneToOne((type) => Job, (job) => job.earner)
    @JoinColumn()
    job: Job

}
