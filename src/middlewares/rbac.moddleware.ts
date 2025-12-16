import { NextFunction, Response } from "express";
import { ApiError } from "../utils/api-error";
import { User } from "../models/auth.model";
import { IGetAuthRequest } from "../types/auth.types";

const RoleBasedAuthenticationControl =
  (roles: string[] = []) =>
    async (req: IGetAuthRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.user || !req.user._id) {
          throw new ApiError(404, "Request user and userId are not found");
        }

        const { _id } = req.user;

        const user = await User.findById(_id).select("-password -refreshToken");

        if (!user) {
          throw new ApiError(404, "user not found");
        }

        if (!user?.role) {
          throw new ApiError(403, "Forbidden: role missing")
        }

        if (user?.role) {
          if (!roles.includes(user?.role)) {
            throw new ApiError(403, "ERROR: Permission DENIED");
          }
        }

        next();
      } catch (err) {
        next(
          new ApiError(
            403,
            "ERROR: ACCESS DENIED, You cant  permission to access this context",
          ),
        );
      }
    };

export default RoleBasedAuthenticationControl;
