import { z } from "zod"
import mongoose from "mongoose"

export const addCategoryValidationSchema = z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        error: "Invalid userID"
    }),
    name: z.string().trim().nonempty("name is required")
})

export const removeCategoryValidationSchema = z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        error: "Invalid userID"
    }),
    name: z.string().trim().nonempty("name is required")
})

export const getAllCategoryValidationSchema = z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        error: "Invalid userID"
    })
})