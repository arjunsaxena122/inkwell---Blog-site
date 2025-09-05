import { z } from "zod"
import mongoose from "mongoose"

export const addCommentValidationSchema = z.object({
    pid: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        error: "Invalid postID"
    }),
    content: z.string().trim().nonempty("content is required").min(1)
})

export const removeCommentValidationSchema = z.object({
    cid: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        error: "Invalid courseID"
    }),
    name: z.string().trim().nonempty("name is required")
})

export const getAllCommentValidationSchema = z.object({
    pid: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        error: "Invalid postID"
    })
})