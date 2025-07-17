import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error";
import jwt from "jsonwebtoken";
import { env } from "../config/config";
import { IUser, User } from "../models/auth.model";


export interface IReq extends Request {
  user: IUser;
}

export const verifyJwt = async (
  req: IReq,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req?.cookies?.accessToken ||
      req?.headers["authorization"]?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, "ERROR : Unauthorised access");
    }

    const decodeToken = jwt.verify(
      token,
      env.ACCESS_TOKEN_KEY,
    ) as jwt.JwtPayload;

    if (!decodeToken) {
      throw new ApiError(401, "ERROR : Unauthorised access");
    }

    const user = await User.findById(decodeToken?.id).select(
      "-password refreshToken",
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(403, "ERROR: ACCESS DENIED");
  }
};
