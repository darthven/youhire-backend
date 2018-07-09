import Category from "../../../db/entities/category"
import JobLocation from "../../../db/entities/job-location"

interface CreateJobRequest {
    location: JobLocation
    category: Category
    details: string
}

export {
    CreateJobRequest
}
