import { EntityRepository, Repository } from "typeorm"

import Job from "../../../db/entities/job"

@EntityRepository(Job)
export default class JobRepository extends Repository<Job> {

}
