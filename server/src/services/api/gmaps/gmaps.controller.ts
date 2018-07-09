import { JsonController, Authorized, HttpCode, Get, CurrentUser, QueryParam } from "routing-controllers"
import { Inject } from "typedi"

import { AuthUser } from "../auth/auth.dto"
import JobLocation from "../../../db/entities/job-location"
import GmapsService from "./gmaps.service"

@JsonController("/api/user/map")
export default class JobController {

    @Inject()
    private service: GmapsService

    @Authorized()
    @HttpCode(200)
    @Get("/location")
    public async getProfile(@CurrentUser({required: true}) user: AuthUser,
                            @QueryParam("lat") lat: number, @QueryParam("lon") lon: number): Promise<JobLocation> {
       return await this.service.getAddressByCoordinates({ lat, lon })
    }

    @Authorized()
    @HttpCode(200)
    @Get("/location/search")
    public async getLocationList(@CurrentUser({required: true}) user: AuthUser,
                                 @QueryParam("name") name: string): Promise<JobLocation[]> {
       return await this.service.getAddressesByName(name)
    }

}
