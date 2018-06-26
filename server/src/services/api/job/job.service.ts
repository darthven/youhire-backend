import { Service } from "typedi"
import * as geocoder from "node-geocoder"

import envConfig from "../../../config/env.config"
import { JobLocation } from "./job.dto"

@Service()
export default class JobService {

    private readonly geocoderOptions: geocoder.Options = {
        provider: "google",
        httpAdapter: "https",
        apiKey: envConfig.GOOGLE_MAPS_API_KEY
    }

    public async getAddressByCoordinates(location: geocoder.Location): Promise<JobLocation> {
        const entry: geocoder.Entry = (await geocoder(this.geocoderOptions).reverse(location)).shift()
        return {
            address: entry.formattedAddress
        }
    }

    public async getAddressesByName(locationName: string): Promise<JobLocation[]> {
        return (await geocoder(this.geocoderOptions).geocode(locationName)).map((entry) => {
            return {
                address: entry.formattedAddress
            }
        })
    }
}
