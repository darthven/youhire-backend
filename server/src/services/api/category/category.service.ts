import { Service } from "typedi"
import { InjectRepository } from "typeorm-typedi-extensions"

import CategoryRepository from "./category.repository"
import Category from "../../../db/entities/category"

@Service()
export default class CategoryService {

    @InjectRepository()
    private repository: CategoryRepository

    public async findCategories(): Promise<Category[]> {
        return this.repository.findAllCategories()
    }

    public async findSubcategories(categoryName: string): Promise<Category[]> {
        const category: Category = await this.repository.findOne({ name: categoryName })
        return this.repository.findAllSubcategories(category)
    }

    public async findAllCategories(): Promise<Category[]> {
        return this.repository.findAllCategoriesWithSubcategories()
    }

}
