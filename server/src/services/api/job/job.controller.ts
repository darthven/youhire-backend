import { JsonController, Authorized, HttpCode, CurrentUser, Post, Body, Get } from "routing-controllers"
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
    @HttpCode(200)
    @Get()
    public async getAllJobsByCurrentUser(@CurrentUser({required: true}) user: AuthUser): Promise<Job[]> {
       return await this.jobService.findAllJobsByCurrentUser(user)
    }

    @Authorized()
    @HttpCode(201)
    @Post("/create")
    public async createJob(@CurrentUser({required: true}) user: AuthUser,
                           @Body() request: CreateJobRequest): Promise<Job> {
       return await this.jobService.createJob(request, user)
    }
}
