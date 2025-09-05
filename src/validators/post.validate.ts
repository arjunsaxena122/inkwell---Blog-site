import { z } from "zod"
import mongoose from "mongoose"

export const createPostValidationSchema = z.object({
    title: z.string().trim().nonempty("Title is required"),
    content: z.string().trim().nonempty("Content is required"),
    category: z.string().trim().nonempty("Content is required").toLowerCase(),
})

export const getPostByIdValidationSchema = z.object({
    pid: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        error: "Invalid postID"
    })
})

export const deletePostByIdValidationSchema = z.object({
    pid: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        error: "Invalid postID"
    })
})

export const updatePostByIdValidationSchema = z.object({
    pid: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        error: "Invalid postID"
    }),
    title: z.string().trim().nonempty("Title is required"),
    content: z.string().trim().nonempty("Content is required"),
    category: z.string().trim().nonempty("Content is required").toLowerCase(),
})

export const getAllPendingPostByAdminValidationSchema = z.object({
    pid: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        error: "Invalid postID"
    })
})

export const approvePostByAdminValidataionSchema = z.object({
    pid: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        error: "Invalid postID"
    })
})

export const rejectPostByAdminValidationSchema = z.object({
    pid: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        error: "Invalid postID"
    })
})