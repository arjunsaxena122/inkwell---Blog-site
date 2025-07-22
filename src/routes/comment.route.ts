import { Router } from "express";
import {
  addComment,
  getAllCommentByPostId,
  removeComment,
} from "../controllers/comment.controller";

const router: Router = Router();

router
  .route("/comment/cid")
  .post(addComment)
  .get(getAllCommentByPostId)
  .delete(removeComment);

export default router;
