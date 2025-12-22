import { z } from "zod"
import mongoose from "mongoose"

export const addCategoryValidationSchema = z.object({
    name: z.string().trim().nonempty("Category name is required")
})

export const removeCategoryValidationSchema = z.object({
    name: z.string().trim().nonempty("name is required")
})
