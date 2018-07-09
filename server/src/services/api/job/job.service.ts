import { Service } from "typedi"

import { InjectRepository } from "typeorm-typedi-extensions"
import { CreateJobRequest } from "./job.dto"
import Job from "../../../db/entities/job"
import JobRepository from "./job.repository"

@Service()
export default class JobService {

    @InjectRepository()
    private repository: JobRepository

    public async createJob(request: CreateJobRequest): Promise<Job> {
        const job = new Job()
        job.spender = request.spender
        job.category = request.category
        job.address = request.location
        job.details = request.details
        job.percentageActivity = 0
        job.status = false
        return await this.repository.save(job)
    }

}
