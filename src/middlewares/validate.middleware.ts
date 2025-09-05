import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { Source } from "../types/validate.type";
import { ApiError } from "../utils/api-error";

export const validate = (schema: ZodType, source: Source[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: Record<string, unknown> = {}
            for (const src of source) {
                Object.assign(data, src)
            }
            await schema.parseAsync(data)
            next()
        } catch (error) {
            next(new ApiError(400, `zod validation failed cause of ${error} `, [error]))
        }
    }
}