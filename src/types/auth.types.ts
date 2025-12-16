import { Request } from "express";
import { Schema } from "mongoose";

type Avatar = {
    url: string;
    localPath: string;
};

export interface IUser {
    _id: Schema.Types.ObjectId;
    avatar?: Avatar;
    fullname?: string;
    username?: string;
    email?: string;
    password?: string;
    isEmailVerified?: boolean;
    role?: string;
    emailVerificationToken?: string | null;
    emailVerificationExpiry?: Date | null;
    forgetPasswordToken?: string | null;
    forgetPasswordExpiry?: Date | null;
    refreshToken?: string;
}

export interface IGetAuthRequest extends Request {
    user?: IUser
}