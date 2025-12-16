import { Request, Response, NextFunction } from "express";
import { env } from "../config/config";

export const customErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = Number(error.statusCode ?? 500);

  return res.status(statusCode).json({
    message: error.message ?? "Internal server error",
    errors: error.errors ?? [],
    success: error.success ?? false,
    stack: env.NODE_ENV === "develoment" ? error?.stack : undefined,
  });
};
