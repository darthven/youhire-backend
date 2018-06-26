import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"

import Job from "./job"

@Entity({
    name: "spenders"
})
export default class Spender {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne((type) => Job, (job) => job.spender)
    @JoinColumn()
    job: Job

}
