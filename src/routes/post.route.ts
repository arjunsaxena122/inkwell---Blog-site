import { Router } from "express";
import {
  approvePostByAdmin,
  createPost,
  deletePostById,
  getAllPendingPostByAdmin,
  getAllPost,
  getPostById,
  rejectPostByAdmin,
  updatePostById,
} from "../controllers/post.controller";
import rbac from "../middlewares/rbac.moddleware";
import { UserRolesEnum } from "../constants/constants";
import { validate } from "../middlewares/validate.middleware";
import {
  approvePostByAdminValidataionSchema,
  createPostValidationSchema,
  deletePostByIdValidationSchema,
  getPostByIdValidationSchema,
  rejectPostByAdminValidationSchema,
  updatePostByIdValidationSchema
} from "../validators/post.validate";

const router: Router = Router();

router
  .route("/admin/posts")
  .get(rbac([UserRolesEnum.ADMIN]), getAllPendingPostByAdmin);
router
  .route("/admin/posts/:pid/aprrove")
  .patch(validate(approvePostByAdminValidataionSchema, ["params"]), rbac([UserRolesEnum.ADMIN]), approvePostByAdmin);
router
  .route("/admin/posts/:pid/reject")
  .patch(validate(rejectPostByAdminValidationSchema, ["params"]), rbac([UserRolesEnum.ADMIN]), rejectPostByAdmin);

router.route("/posts").post(validate(createPostValidationSchema, ["params", "body"]), createPost);
router
  .route("/posts/:pid")
  .get(
    validate(getPostByIdValidationSchema, ["params"]),
    getPostById
  )
  .put(
    validate(updatePostByIdValidationSchema, ["params"]),
    rbac([UserRolesEnum.USER]),
    updatePostById
  )
  .delete(
    validate(deletePostByIdValidationSchema, ["params"]),
    rbac([UserRolesEnum.USER]),
    deletePostById
  );
router.route("/posts").get(getAllPost);

export default router;
