import { Router } from "express";
import {
  addCategory,
  getAllCategory,
  removeCategory,
} from "../controllers/category.controller";
import rbac from "../middlewares/rbac.moddleware";
import { UserRolesEnum } from "../constants/constants";
import { validate } from "../middlewares/validate.middleware";
import { addCategoryValidationSchema, getAllCategoryValidationSchema, removeCategoryValidationSchema } from "../validators/category.validate";

const router: Router = Router();

router.route("/add").post(validate(addCategoryValidationSchema, ["body", "params"]), rbac([UserRolesEnum.ADMIN]), addCategory);
router.route("/remove").post(validate(removeCategoryValidationSchema, ["body", "params"]), rbac([UserRolesEnum.ADMIN]), removeCategory);
router
  .route("/get-all-category")
  .post(validate(getAllCategoryValidationSchema, ["params"]), rbac([UserRolesEnum.ADMIN, UserRolesEnum.USER]), getAllCategory);

export default router;
