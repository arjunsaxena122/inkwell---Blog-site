import { User } from "../models/auth.model";
import { ApiError } from "../utils/api-error";
import crypto from "crypto";

type Token = {
  accessToken: string;
  refreshToken: string;
};

export const generateRandomString = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateAccessAndRefreshToken = async (
  id: string,
): Promise<Token> => {
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(401, "Invalid credentionals");
  }

  const accessToken = user.generatingAccessToken();
  const refreshToken = user.generatingRefreshToken();

  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};
