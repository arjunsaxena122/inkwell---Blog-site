import { asyncHandler } from "../utils/async-handler";

const userRegister = asyncHandler(async () => {});

const userLogin = asyncHandler(async () => {});

const userLogout = asyncHandler(async () => {});

const userGetMe = asyncHandler(async () => {});

const userVerifiedEmail = asyncHandler(async () => {});

const resendEmailVerifiedLink = asyncHandler(async () => {});

const generateNewAccessAndRefreshToken = asyncHandler(async () => {});

const changePassword = asyncHandler(async () => {});

const forgetPassword = asyncHandler(async () => {});

const resetPassword = asyncHandler(async () => {});


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
    resetPassword
}