import { Service } from "typedi"
import * as geocoder from "node-geocoder"

import envConfig from "../../../config/env.config"
import JobLocation from "../../../db/entities/job-location"

@Service()
export default class GmapsService {

    private readonly geocoderOptions: geocoder.Options = {
        provider: "google",
        httpAdapter: "https",
        apiKey: envConfig.GOOGLE_MAPS_API_KEY
    }

    public async getAddressByCoordinates(location: geocoder.Location): Promise<JobLocation> {
        const entry: geocoder.Entry = (await geocoder(this.geocoderOptions).reverse(location)).shift()
        return this.extractLocationFromEntry(entry)
    }

    public async getAddressesByName(locationName: string): Promise<JobLocation[]> {
        return (await geocoder(this.geocoderOptions).geocode(locationName)).map((entry) => {
            return this.extractLocationFromEntry(entry)
        })
    }

    private extractLocationFromEntry(entry: geocoder.Entry): JobLocation {
        return {
            streetNumber: entry.streetNumber,
            streetName: entry.streetName,
            city: entry.city,
            district: entry.administrativeLevels.level2long,
            country: entry.country,
            zipcode: entry.zipcode
        }
    }
}
