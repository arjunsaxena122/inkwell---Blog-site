import { Router } from "express";
import {
  addCategory,
  getAllCategory,
  removeCategory,
} from "../controllers/category.controller";
import rbac from "../middlewares/rbac.moddleware";
import { UserRolesEnum } from "../utils/constants";

const router: Router = Router();

router.route("/add").post(rbac([UserRolesEnum.ADMIN]), addCategory);
router.route("/remove").post(rbac([UserRolesEnum.ADMIN]), removeCategory);
router.route("/get-all-category/:cid").post(rbac([UserRolesEnum.ADMIN]), getAllCategory);

export default router;
