import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/config";
import { AvailableUserRolesEnum, UserRolesEnum } from "../utils/constants";

type Avatar = {
  url: string;
  localPath: string;
};

export type IUser = {
  avatar: Avatar;
  username: string;
  fullname?: string;
  email: string;
  password: string;
  isEmailVerified?: boolean;
  role: string;
  emailVerificationLink?: string;
  emailVerificationExpiry?: Date;
  forgetPasswordToken?: string;
  forgetPasswordExpiry?: Date;
  refreshToken?: string;
};

const userSchema = new mongoose.Schema<IUser>(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: "https://placehold.co/600x400",
        localPath: "",
      },
      _id: false,
    },

    username: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    fullname: {
      type: String,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: AvailableUserRolesEnum,
      default: UserRolesEnum?.USER,
    },

    emailVerificationLink: {
      type: String,
      trim: true,
    },

    emailVerificationExpiry: {
      type: Date,
    },

    forgetPasswordToken: {
      type: String,
    },

    forgetPasswordExpiry: {
      type: Date,
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre<IUser & mongoose.Document>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isValidPassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generatingAccessToken = function () {
  return jwt.sign({ id: this._id }, env.ACCESS_TOKEN_KEY, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
  });
};

userSchema.methods.generatingRefreshToken = function () {
  return jwt.sign({ id: this._id }, env.REFRESH_TOKEN_KEY, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
  });
};

export const User = mongoose.model<IUser>("User", userSchema);
