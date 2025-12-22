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
import { verifyJwt } from "../middlewares/auth.middleware";

const router: Router = Router();

// ! ADMIN 

router
  .route("/posts/admin")
  .get(
    verifyJwt,
    rbac([UserRolesEnum.ADMIN]),
    getAllPendingPostByAdmin
  );

router
  .route("/posts/:pid/admin/approve")
  .patch(
    validate(approvePostByAdminValidataionSchema, ["params"]),
    verifyJwt,
    rbac([UserRolesEnum.ADMIN]),
    approvePostByAdmin
  );

router
  .route("/posts/:pid/admin/reject")
  .patch(
    validate(rejectPostByAdminValidationSchema, ["params"]),
    verifyJwt,
    rbac([UserRolesEnum.ADMIN]),
    rejectPostByAdmin
  );


// ! User
router
  .route("/posts/getAllPost")
  .get(
    verifyJwt,
    rbac([UserRolesEnum.ADMIN, UserRolesEnum.USER]),
    getAllPost
  );

router
  .route("/posts")
  .post(
    validate(createPostValidationSchema, ["params", "body"]),
    verifyJwt,
    rbac([UserRolesEnum.ADMIN, UserRolesEnum.USER]),
    createPost
  );



router
  .route("/posts/:pid")
  .get(
    validate(getPostByIdValidationSchema, ["params"]),
    getPostById
  )
  .put(
    validate(updatePostByIdValidationSchema, ["params"]),
    rbac([UserRolesEnum.USER, UserRolesEnum.ADMIN]),
    updatePostById
  )
  .delete(
    validate(deletePostByIdValidationSchema, ["params"]),
    rbac([UserRolesEnum.USER, UserRolesEnum.ADMIN]),
    deletePostById
  );



export default router;
