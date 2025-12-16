import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { Source } from "../types/validate.type"
import { ApiError } from "../utils/api-error";

export const validate = (schema: ZodType, source: Source[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: Record<string, unknown> = {}
            for (const src of source) {
                Object.assign(data, req[src])
            }
            await schema.parseAsync(data)
            next()
        } catch (error: unknown) {
            const errorMessage = (error instanceof ZodError) ? error?.issues[0].message : "Internal server error";
            next(new ApiError(400, `Validation Error: ${errorMessage}`, [error]))
        }
    }
}