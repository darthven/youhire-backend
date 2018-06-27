import { seedCategories } from "./category.seed"
import { seedGenders } from "./gender.seed"

export const seed = () => {
    seedCategories()
    seedGenders()
}
