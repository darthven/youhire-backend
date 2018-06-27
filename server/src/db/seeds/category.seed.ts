
import { getManager, TreeRepository } from "typeorm"

import Category from "../entities/category"

interface CategoryNode {
    name: string,
    price?: number,
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
            price: 234.2
        },
        {
            name: "Gutter cleaning",
            price: 123.5
        },
        {
            name: "Home",
            price: 434.2
        },
        {
            name: "Office",
            price: 56.23
        },
        {
            name: "Pool",
            price: 78.54
        },
        {
            name: "Window washing",
            price: 34.8
        },
        {
            name: "Yard",
            price: 234.2
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
            price: 234.2
        },
        {
            name: "Packing and Unpacking service",
            price: 123.5
        },
        {
            name: "Professional Organizer",
            price: 434.2
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
            price: 234.2
        },
        {
            name: "Furniture Assembler",
            price: 123.5
        },
        {
            name: "Graffiti removal",
            price: 434.2
        },
        {
            name: "Plumber",
            price: 56.23
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
            price: 234.2
        },
        {
            name: "Pet grooming",
            price: 123.5
        },
        {
            name: "Pet sitting",
            price: 434.2
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
            price: 234.2
        },
        {
            name: "Security Guard",
            price: 123.5
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
            price: 234.2
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
            price: 234.2
        },
        {
            name: "Make-Up artist",
            price: 123.5
        },
        {
            name: "Manicure / Pedicure Specialist",
            price: 434.2
        },
        {
            name: "Marijuana delivery",
            price: 56.23
        },
        {
            name: "Massage Therapist",
            price: 234.2
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
        subCategory.price = child.price
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
