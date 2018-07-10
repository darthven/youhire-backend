import { JsonController, HttpCode, Get } from "routing-controllers"
import { Inject } from "typedi"

import CategoryService from "./category.service"
import Category from "../../../db/entities/category"

@JsonController("/categories")
export class CategoryController {

    @Inject()
    private service: CategoryService

    /**
     * TODO remove before release
     */
    @HttpCode(200)
    @Get()
    public async getAllCategories(): Promise<Category[]> {
        return await this.service.findAllCategories()
    }

}
