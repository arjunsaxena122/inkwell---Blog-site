import { Router } from "express";
import {
  addCategory,
  getAllCategory,
  removeCategory,
} from "../controllers/category.controller";
import rbac from "../middlewares/rbac.moddleware";
import { UserRolesEnum } from "../constants/constants";
import { validate } from "../middlewares/validate.middleware";
import { addCategoryValidationSchema, removeCategoryValidationSchema } from "../validators/category.validate";
import { verifyJwt } from "../middlewares/auth.middleware";

const router: Router = Router();

router
  .route("/add-category")
  .post(
    validate(addCategoryValidationSchema, ["body"]),
    verifyJwt,
    rbac([UserRolesEnum.ADMIN]),
    addCategory
  );

router
  .route("/remove-category")
  .delete(
    validate(removeCategoryValidationSchema, ["body"]),
    verifyJwt,
    rbac([UserRolesEnum.ADMIN]),
    removeCategory
  );

router
  .route("/get-all-category")
  .get(
    verifyJwt,
    rbac([UserRolesEnum.ADMIN, UserRolesEnum.USER]),
    getAllCategory
  );

export default router;
