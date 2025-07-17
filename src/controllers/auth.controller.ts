import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { User } from "../models/auth.model";
import { ApiResponse } from "../utils/api-response";
import { env } from "../config/config";
import {
  generateAccessAndRefreshToken,
  generateRandomString,
} from "../helper/accessAndRefreshToken";
import { IReq } from "../middlewares/auth.middleware";
import {
  customeEmailSender,
  customEmailVerificationSender,
  customForgetPasswordSender,
} from "../utils/nodemailer";
import jwt from "jsonwebtoken";

const userRegister = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, `Please fill the require field`);
  }

  const existedUser = await User.find({
    $or: [username, email],
  });

  if (existedUser) {
    throw new ApiError(409, "Credentional already exist");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  const loggedInUser = await User.findById(user?._id).select("-password");

  if (!loggedInUser) {
    throw new ApiError(500, "Interal server issue, Please retry!");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", loggedInUser));
});

const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, `Please fill the require field`);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      401,
      "Credentional doesn't exist, Please registered first!",
    );
  }

  const isCorrectPassword = await user.isValidPassword(password);

  if (!isCorrectPassword) {
    throw new ApiError(401, "Invalid Credentional");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id.toString(),
  );

  const accessOptions = {
    httpOnly: true,
    secure: true,
    strict: env.NODE_ENV === "development" ? "none" : true,
    maxAge: 1000 * 60 * 30,
  };

  const refreshOptions = {
    httpOnly: true,
    secure: true,
    strict: env.NODE_ENV === "development" ? "none" : true,
    maxAge: 1000 * 60 * 60 * 24,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessOptions)
    .cookie("refreshToken", refreshToken, refreshOptions)
    .json(new ApiResponse(200, "Login successfully"));
});

const userLogout = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = (req as IReq)?.user;

  if (!_id) {
    throw new ApiError(404, "User requested Id doesn't exist");
  }

  const user = await User.findByIdAndUpdate(
    _id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true },
  ).select("-password");

  const accessOptions = {
    httpOnly: true,
    secure: true,
    strict: env.NODE_ENV === "development" ? "none" : true,
    maxAge: 1000 * 60 * 30,
  };

  const refreshOptions = {
    httpOnly: true,
    secure: true,
    strict: env.NODE_ENV === "development" ? "none" : true,
    maxAge: 1000 * 60 * 60 * 24,
  };

  return res
    .status(200)
    .clearCookie("accessToken", accessOptions)
    .clearCookie("refreshToken", refreshOptions)
    .json(new ApiResponse(200, "Logout Successfully", user));
});

const userGetMe = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = (req as IReq)?.user;

  const user = await User.findById(_id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, `Fetch ${user?.username} information`, user));
});

const userVerifiedEmail = asyncHandler(async (req: Request, res: Response) => {
  const { randToken } = req.params;

  if (!randToken) {
    throw new ApiError(400, "Token not found");
  }

  const user = await User.findOne({
    $and: [
      { emailVerificationToken: randToken },
      { emailVerificationExpiry: { $gt: Date.now() } },
    ],
  });

  if (!user) {
    throw new ApiError(410, "Verification link is an expired");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  user.save();

  return res.status(200).json(new ApiResponse(200, "Email is verified"));
});

const resendEmailVerifiedLink = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id } = (req as IReq).user;

    if (!_id) {
      throw new ApiError(404, "Id not found");
    }

    const user = await User.findById(_id).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const randToken: string = generateRandomString();
    user.emailVerificationToken = randToken;
    user.emailVerificationExpiry = new Date(Date.now() * 1000 * 60 * 2);
    user.save({ validateBeforeSave: false });

    await customeEmailSender({
      mailGen: customEmailVerificationSender(
        user?.username,
        `http://localhost:3000/api/v1/auth/verify-email/${randToken}`,
      ),
      fromSender: "inkwell@official.com",
      toReceiver: user?.email,
      subject: "Email Verification Link",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Resend email verification link"));
  },
);

const generateNewAccessAndRefreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req?.cookies?.refreshToken;

    if (!token) {
      throw new ApiError(401, "Please Login!");
    }

    const decodeToken = jwt.verify(
      token,
      env.REFRESH_TOKEN_KEY,
    ) as jwt.JwtPayload;

    const user = await User.findById(decodeToken?.id);

    if (!user) {
      throw new ApiError(401, "Unauthroised: Invalid Token");
    }

    if (user.refreshToken !== token) {
      throw new ApiError(401, "Unauthroised: Invalid Token");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id.toString(),
    );

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    const accessOptions = {
      httpOnly: true,
      secure: true,
      strict: env.NODE_ENV === "development" ? "none" : true,
      maxAge: 1000 * 60 * 30,
    };

    const refreshOptions = {
      httpOnly: true,
      secure: true,
      strict: env.NODE_ENV === "development" ? "none" : true,
      maxAge: 1000 * 60 * 60 * 24,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, accessOptions)
      .cookie("refreshToken", refreshToken, refreshOptions)
      .json(
        new ApiResponse(
          200,
          "New generate access and refresh token Successfully",
        ),
      );
  },
);

const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = (req as IReq)?.user;
  const { newPassword, confirmPassword } = req.body;

  if (!_id) {
    throw new ApiError(404, "Id not found");
  }

  if (!newPassword || !confirmPassword) {
    throw new ApiError(400, "Please fill the required fields");
  }

  const user = await User.findById(_id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New and Confirm password doesn't match");
  }

  const isCheckOldPassword = await user.isValidPassword(newPassword);

  if (isCheckOldPassword) {
    throw new ApiError(401, "Please enter the unique password");
  }

  user.password = newPassword;
  user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Password change successfully"));
});

const forgetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Please fill the required field");
  }

  const user = await User.findOne({ email }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const randToken: string = generateRandomString();

  user.forgetPasswordToken = randToken;
  user.forgetPasswordExpiry = new Date(Date.now() * 1000 * 60 * 2);
  user.save();

  await customeEmailSender({
    mailGen: customForgetPasswordSender(
      user?.username,
      `http://localhost:3000/api/v1/auth/reset-email/${randToken}`,
    ),
    fromSender: "inkwell@official.com",
    toReceiver: user?.email,
    subject: "Email Verification Link",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "forgetten password email sent"));
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { randToken } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (!randToken) {
    throw new ApiError(400, "Token not found");
  }

  const user = await User.findOne({
    $and: [
      { forgetPasswordToken: randToken },
      { forgetPasswordExpiry: { $gt: Date.now() } },
    ],
  });

  if (!user) {
    throw new ApiError(410, "Verification link is an expired");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New and Confirm password doesn't match");
  }

  user.password = newPassword;
  user.forgetPasswordToken = null;
  user.forgetPasswordExpiry = null;
  user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successfully"));
});

export {
  userRegister,
  userLogin,
  userLogout,
  userGetMe,
  userVerifiedEmail,
  resendEmailVerifiedLink,
  generateNewAccessAndRefreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
