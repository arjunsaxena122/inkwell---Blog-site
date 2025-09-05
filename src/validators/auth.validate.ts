import { z } from "zod"
import mongoose from "mongoose"

export const userRegisterValidationSchema = z.object({
    username: z.string({
        message: "username must be in string"
    }).trim().nonempty({
        message: "username field is required",
    }).toLowerCase(),
    email: z.email({
        error: "Invalid email"
    }).trim().nonempty({
        error: "Email is required"
    }).toLowerCase(),
    password: z
        .string()
        .trim()
        .nonempty({
            error: "Password is required",
        })
        .min(8, { message: "Password must be minimum 8 length" })
        .max(16, { message: "Password length exceed" }),
})

export const userLoginValidationSchema = z.object({
    email: z.email({
        error: "Invalid email"
    }).trim().nonempty({
        error: "Email is required"
    }).toLowerCase(),
    password: z
        .string()
        .trim()
        .nonempty({
            error: "Password is required",
        })
        .min(8, { message: "Password must be minimum 8 length" })
        .max(16, { message: "Password length exceed" })
})

export const userLogoutValidationSchema = z.object({
    id : z.string().refine((val) => mongoose.Types.ObjectId.isValid(val),{
        error : "Invalid userID"
    })
})

export const userGetMeValidationSchema = z.object({
    id : z.string().refine((val) => mongoose.Types.ObjectId.isValid(val),{
        error : "Invalid userID"
    })
})