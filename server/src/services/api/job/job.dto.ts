import Spender from "../../../db/entities/spender"
import Category from "../../../db/entities/category"
import JobLocation from "../../../db/entities/job-location"

interface CreateJobRequest {
    location: JobLocation
    category: Category
    spender: Spender
    details: string
}

export {
    CreateJobRequest
}
