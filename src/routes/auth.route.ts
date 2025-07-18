import { Router } from "express";
import {
  changePassword,
  forgetPassword,
  generateNewAccessAndRefreshToken,
  resendEmailVerifiedLink,
  resetPassword,
  updateAvatar,
  userGetMe,
  userLogin,
  userLogout,
  userRegister,
  userVerifiedEmail,
} from "../controllers/auth.controller";
import { verifyJwt } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router: Router = Router();

router.route("/user-register").post(userRegister);
router.route("/user-login").post(userLogin);
router.route("/user-logout").get(verifyJwt, userLogout);
router.route("/get-me").get(userGetMe);
router.route("/resend-email-link").get(resendEmailVerifiedLink);
router.route("/verify-email").get(userVerifiedEmail);
router.route("/api-key").get(generateNewAccessAndRefreshToken);
router.route("/change-password").patch(changePassword);
router.route("/forget-password").get(forgetPassword);
router.route("/reset-password").get(resetPassword);
router.route("/avatar").patch(upload.single("avatar"), updateAvatar);

export default router;
