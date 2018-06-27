import { Service } from "typedi"
import { EntityRepository, TreeRepository } from "typeorm"
import Category from "../../../db/entities/category"

@Service()
@EntityRepository(Category)
export default class CategoryRepository extends TreeRepository<Category> {

    public async findAllCategoriesWithSubcategories(): Promise<Category[]> {
        return await this.findTrees()
    }

    public async findAllCategories(): Promise<Category[]> {
        return await this.findRoots()
    }

    public async findAllSubcategories(category: Category): Promise<Category[]> {
        return await this.findDescendants(category)
    }

    public async findSubcategoriesByNames(category: Category, names: string[]): Promise<Category[]> {
        return (await this.findDescendants(category)).filter((cat) => names.includes(cat.name))
    }
}
