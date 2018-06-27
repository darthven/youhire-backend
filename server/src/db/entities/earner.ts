import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, Column } from "typeorm"

import Category from "./category"
import Job from "./job"

@Entity({
    name: "earners"
})
export default class Earner {

    @PrimaryGeneratedColumn()
    id: number

    @Column((type) => Category)
    category: Category

    @OneToOne((type) => Job, (job) => job.earner)
    @JoinColumn()
    job: Job

}
