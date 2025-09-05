import { Router } from "express";
import {
  addComment,
  getAllCommentByPostId,
  removeComment,
} from "../controllers/comment.controller";
import { validate } from "../middlewares/validate.middleware";
/*  */import { addCommentValidationSchema, getAllCommentValidationSchema, removeCommentValidationSchema } from "../validators/comment.validate";

const router: Router = Router();

router
  .route("/comment/cid")
  .post(validate(addCommentValidationSchema, ["body", "params"]), addComment)
  .get(validate(getAllCommentValidationSchema, ["params"]), getAllCommentByPostId)
  .delete(validate(removeCommentValidationSchema, ["body", "params"]), removeComment);

export default router;
