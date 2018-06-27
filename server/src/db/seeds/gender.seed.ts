import { Repository, getManager } from "typeorm"

import Gender from "../entities/gender"

enum GenderType {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}

const genderList: Gender[] = [new Gender(GenderType.MALE), new Gender(GenderType.FEMALE), new Gender(GenderType.OTHER)]

export const seedGenders = async (): Promise<void> => {
    const repository: Repository<Gender> = getManager().getRepository(Gender)
    if (await repository.count() === 0) {
        genderList.forEach(async (gender) => await repository.save(gender))
    }
}
