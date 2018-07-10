import { Service } from "typedi"

import { InjectRepository } from "typeorm-typedi-extensions"
import { CreateJobRequest } from "./job.dto"
import Job from "../../../db/entities/job"
import JobRepository from "./job.repository"
import { AuthUser } from "../auth/auth.dto"
import SpenderRepository from "../spender/spender.repository"
import CategoryRepository from "../category/category.repository"

@Service()
export default class JobService {

    @InjectRepository()
    private jobRepository: JobRepository

    @InjectRepository()
    private spenderRepository: SpenderRepository

    @InjectRepository()
    private categoryRepository: CategoryRepository

    public async createJob(request: CreateJobRequest, user: AuthUser): Promise<Job> {
        const job = new Job()
        job.spender = await this.spenderRepository.findSpenderByIdAndStripeAccount(user.id)
        job.category = await this.categoryRepository.findOne({name: request.category.name})
        job.address = request.location
        job.details = request.details
        job.percentageActivity = 0
        job.status = false
        return await this.jobRepository.save(job)
    }

    /**
     * TODO remove before release
     */
    public async findAllJobsByCurrentUser(user: AuthUser): Promise<Job[]> {
      return await this.jobRepository.findAllJobsByCurrentUser(user.id)
    }

}
