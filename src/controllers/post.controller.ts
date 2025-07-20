import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { Post } from "../models/post.model";
import { ApiResponse } from "../utils/api-response";

const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    throw new ApiError(400, "Please fill all the required fields");
  }

  const existedPost = await Post.findOne({
    title,
  });

  if (existedPost) {
    throw new ApiError(409, "Please gives unique post title");
  }

  const post = await Post.create({
    title,
    content,
    category,
    likes: 0,
    comments: 0,
    subscribe: 0,
    viewsCount: 0,
    author: req?.user?._id,
  });

  const createdPost = await Post.findById(post?._id);

  if (!createdPost) {
    throw new ApiError(500, "Internal server issue, Please try again!");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Blog create successfully", createdPost));
});

const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { pid } = req.params;

  if (!pid) {
    throw new ApiError(404, "Post id not found");
  }

  const post = await Post.findById(pid);

  if (!post) {
    throw new ApiError(404, "This blog post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, `Post fetched successfully`, post));
});

const getAllPost = asyncHandler(async (req: Request, res: Response) => {});

const deletePostById = asyncHandler(async (req: Request, res: Response) => {
  const { pid } = req.params;

  if (!pid) {
    throw new ApiError(404, "Post id not found");
  }

  const post = await Post.findById(pid);

  if (!post) {
    throw new ApiError(404, "This blog post not found");
  }

  const delPost = await Post.findByIdAndDelete(post?._id);

  if (!delPost) {
    throw new ApiError(
      500,
      "Internal server issue, This blog post couldn't delete yet",
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, `Post delete successfully`, delPost));
});

const updatePostById = asyncHandler(async (req: Request, res: Response) => {
  const { pid } = req.params;
  const { title, content, category } = req.body;

  if (!pid) {
    throw new ApiError(404, "Post id not found");
  }

  const post = await Post.findById(pid);

  if (!post) {
    throw new ApiError(404, "This blog post not found");
  }

  if (!title || !content || !category) {
    throw new ApiError(400, "Please fill all the required fields");
  }

  const existedPost = await Post.findOne({
    title,
  });

  if (existedPost) {
    throw new ApiError(409, "Please gives unique post title");
  }

  const updatePost = await Post.findByIdAndUpdate(
    post?._id,
    {
      $set: {
        title,
        content,
        category,
      },
    },
    { new: true },
  );

  if (!updatePost) {
    throw new ApiError(
      500,
      "Internal server issue, This blog post couldn't update yet",
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, `Post delete successfully`, updatePost));
});

export { createPost, getPostById, getAllPost, deletePostById, updatePostById };
