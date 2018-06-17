import { getManager, Repository } from "typeorm";

import User from "../entities/user";

const users = [
    {
        firstName: "Adam",
        lastName: "Jansen",
        age: 55,
        email: "adamjansen@gmail.com",
        birthDate: "2011-10-05T14:48:00.000Z"
    },
    {
        firstName: "Jon",
        lastName: "Lord",
        age: 78,
        email: "adamjansen@gmail.com",
        birthDate: "2011-10-05T14:48:00.000Z"
    },
    {
        firstName: "Winston",
        lastName: "Ellis",
        age: 33,
        email: "adamjansen@gmail.com",
        birthDate: "2011-10-05T14:48:00.000Z"
    }
]

export const seed = () => {
    const repository: Repository<User> = getManager().getRepository(User)
    users.forEach((user) => {
        repository.save(user)
    })
}
