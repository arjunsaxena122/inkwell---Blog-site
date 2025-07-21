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
import { UserRolesEnum } from "../utils/constants";

const router: Router = Router();

router
  .route("/admin/posts")
  .get(rbac([UserRolesEnum.ADMIN]), getAllPendingPostByAdmin);
router
  .route("/admin/posts/:pid/aprrove")
  .patch(rbac([UserRolesEnum.ADMIN]), approvePostByAdmin);
router
  .route("/admin/posts/:pid/reject")
  .patch(rbac([UserRolesEnum.ADMIN]), rejectPostByAdmin);

router.route("/posts").post(createPost);
router
  .route("/posts/:pid")
  .get(getPostById)
  .put(rbac([UserRolesEnum.USER]), updatePostById)
  .delete(rbac([UserRolesEnum.USER]), deletePostById);
router.route("/posts").get(getAllPost);

export default router;
