import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error";
import { User } from "../models/auth.model";

const RoleBasedAuthenticationControl =
  (roles: string[] = []) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user._id) {
        throw new ApiError(404, "Request user and userId are not found");
      }

      const { _id } = req.user;

      const user = await User.findById(_id).select("-password -refreshToken");

      if (!user) {
        throw new ApiError(404, "user not found");
      }

      if (!roles.includes(user?.role)) {
        throw new ApiError(403, "ERROR: Permission DENIED");
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
