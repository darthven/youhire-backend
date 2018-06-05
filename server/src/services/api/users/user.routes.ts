import { getUserById, saveUser } from "./user.controller";

export const UserRoutes = [
    {
        path: "/users/:id",
        method: "get",
        action: getUserById
    },
    {
        path: "/users",
        method: "post",
        action: saveUser
    }
]
