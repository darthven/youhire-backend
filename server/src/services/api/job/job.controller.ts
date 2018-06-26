import { JsonController, Authorized, HttpCode, Get, CurrentUser, QueryParam } from "routing-controllers"
import { Inject } from "typedi"

import { AuthUser } from "../auth/auth.dto"
import JobService from "./job.service"

@JsonController("/api/user/job")
export default class JobController {

    @Inject()
    private jobService: JobService

    @Authorized()
    @HttpCode(200)
    @Get("/location")
    public async getProfile(@CurrentUser({required: true}) user: AuthUser,
                            @QueryParam("lat") lat: number, @QueryParam("lon") lon: number) {
       return await this.jobService.getAddressByCoordinates({ lat, lon })
    }

    @Authorized()
    @HttpCode(200)
    @Get("/location/search")
    public async getLocationList(@CurrentUser({required: true}) user: AuthUser,
                                 @QueryParam("name") name: string) {
       return await this.jobService.getAddressesByName(name)
    }
}
