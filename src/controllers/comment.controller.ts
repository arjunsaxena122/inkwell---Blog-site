import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { Comment } from "../models/comment.model";
import { ApiResponse } from "../utils/api-response";
import { IGetAuthRequest } from "../types/auth.types";

const addComment = asyncHandler(async (req: IGetAuthRequest, res: Response) => {
  const { content } = req.body;
  const { pid } = req.params;

  if (!pid) {
    throw new ApiError(404, "postId not found");
  }

  if (!content) {
    throw new ApiError(400, "Please fill the required fields");
  }

  const comment = await Comment.create({
    content,
    post: { pid },
    user: req?.user?._id,
  });

  const isCreatedComment = await Comment.findById(comment?._id);

  if (!isCreatedComment) {
    throw new ApiError(500, "Interal server error, Please try again!");
  }

  return res.status(201).json(new ApiResponse(201, "comment is added"));
});

const removeComment = asyncHandler(async (req: Request, res: Response) => {
  const { cid } = req.params;

  if (!cid) {
    throw new ApiError(404, "postId not found");
  }

  const comment = await Comment.findById(cid);

  if (comment) {
    throw new ApiError(200, "no comment");
  }

  const deletedComment = await Comment.findByIdAndDelete(cid);

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully", deletedComment));
});

const getAllCommentByPostId = asyncHandler(
  async (req: Request, res: Response) => {
    const { pid } = req.params;

    if (!pid) {
      throw new ApiError(404, "postId not found");
    }

    const comment = await Comment.findById(pid);

    if (!comment) {
      throw new ApiError(404, "no comment");
    }

    return res.status(200).json(new ApiResponse(200, "fetched all comments"));
  },
);

export { addComment, removeComment, getAllCommentByPostId };
