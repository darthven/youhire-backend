import { JsonController, Authorized, HttpCode, Get, CurrentUser, QueryParam } from "routing-controllers"
import { Inject } from "typedi"

import { AuthUser } from "../auth/auth.dto"
import JobService from "./job.service"
import { CreateJobRequest } from "./job.dto"
import Job from "../../../db/entities/job"

@JsonController("/api/user/job")
export default class JobController {

    @Inject()
    private jobService: JobService

    @Authorized()
    @HttpCode(201)
    @Get("/job/create")
    public async createJob(@CurrentUser({required: true}) user: AuthUser, request: CreateJobRequest): Promise<Job> {
       return await this.jobService.createJob(request)
    }
}
