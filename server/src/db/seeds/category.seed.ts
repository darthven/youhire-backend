
import { getManager, TreeRepository } from "typeorm"

import Category from "../entities/category"

interface CategoryNode {
    name: string
    minPrice?: number
    maxPrice?: number
    certificate?: string
}

interface Tree<T> {
    parent: T,
    children: T[]
}

const CLEANING: Tree<CategoryNode> = {
    parent: {
        name: "Cleaning"
    },
    children: [
        {
            name: "Farm",
            minPrice: 234.2
        },
        {
            name: "Gutter cleaning",
            minPrice: 123.5
        },
        {
            name: "Home",
            minPrice: 434.2
        },
        {
            name: "Office",
            minPrice: 56.23
        },
        {
            name: "Pool",
            minPrice: 78.54
        },
        {
            name: "Window washing",
            minPrice: 34.8
        },
        {
            name: "Yard",
            minPrice: 234.2
        }
    ]
}

const GENERAL_HELP: Tree<CategoryNode> = {
    parent: {
        name: "General Help"
    },
    children: [
        {
            name: "General Worker",
            minPrice: 234.2
        },
        {
            name: "Packing and Unpacking service",
            minPrice: 123.5
        },
        {
            name: "Professional Organizer",
            minPrice: 434.2
        }
    ]
}

const HANDYMAN: Tree<CategoryNode> = {
    parent: {
        name: "Handyman"
    },
    children: [
        {
            name: "Electrician",
            minPrice: 234.2
        },
        {
            name: "Furniture Assembler",
            minPrice: 123.5
        },
        {
            name: "Graffiti removal",
            minPrice: 434.2
        },
        {
            name: "Plumber",
            minPrice: 56.23
        }
    ]
}

const PETS: Tree<CategoryNode> = {
    parent: {
        name: "Pets"
    },
    children: [
        {
            name: "Dog Walker",
            minPrice: 234.2
        },
        {
            name: "Pet grooming",
            minPrice: 123.5
        },
        {
            name: "Pet sitting",
            minPrice: 434.2
        }
    ]
}

const SECURITY: Tree<CategoryNode> = {
    parent: {
        name: "Security"
    },
    children: [
        {
            name: "Locksmith",
            minPrice: 234.2
        },
        {
            name: "Security Guard",
            minPrice: 123.5
        }
    ]
}

const TRANSPORT_SERVICES: Tree<CategoryNode> = {
    parent: {
        name: "Transport Services"
    },
    children: [
        {
            name: "Transport Towing",
            minPrice: 234.2
        }
    ]
}

const WELLNESS_BEAUTY: Tree<CategoryNode> = {
    parent: {
        name: "Wellness & Beauty"
    },
    children: [
        {
            name: "Hairdresser",
            minPrice: 234.2
        },
        {
            name: "Make-Up artist",
            minPrice: 123.5
        },
        {
            name: "Manicure / Pedicure Specialist",
            minPrice: 434.2
        },
        {
            name: "Marijuana delivery",
            minPrice: 56.23
        },
        {
            name: "Massage Therapist",
            minPrice: 234.2
        }
    ]
}

const categories: Array<Tree<CategoryNode>> = [ CLEANING, GENERAL_HELP, HANDYMAN, PETS,
    SECURITY, TRANSPORT_SERVICES, WELLNESS_BEAUTY ]

const seedCategory = async (categoryTree: Tree<CategoryNode>, repository: TreeRepository<Category>): Promise<void> => {
    const { parent, children } = categoryTree
    const category = new Category()
    category.name = parent.name
    const savedCategory = await repository.save(category)
    children.forEach(async (child) => {
        const subCategory = new Category()
        subCategory.name = child.name
        subCategory.minPrice = child.minPrice
        subCategory.maxPrice = child.maxPrice
        subCategory.certificate = child.certificate
        subCategory.parentCategory = savedCategory
        await repository.save(subCategory)
    })
}

export const seedCategories = async (): Promise<void> => {
    const repository: TreeRepository<Category> = getManager().getTreeRepository(Category)
    if (await repository.count() === 0) {
        categories.forEach((category) => {
            seedCategory(category, repository)
        })
    }
}
