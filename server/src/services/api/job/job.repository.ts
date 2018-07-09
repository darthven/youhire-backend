import { EntityRepository, Repository } from "typeorm"

import Job from "../../../db/entities/job"

@EntityRepository(Job)
export default class JobRepository extends Repository<Job> {

    public async findAllJobsByCurrentUser(userId: number): Promise<Job[]> {
        return (await this.find({ relations: ["spender"]})).filter((job) => job.spender.id === userId)
    }

}
