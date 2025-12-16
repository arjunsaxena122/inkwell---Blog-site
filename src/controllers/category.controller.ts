import { Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { Category } from "../models/category.model";
import { ApiResponse } from "../utils/api-response";
import { UserRolesEnum } from "../constants/constants";
import { IGetAuthRequest } from "../types/auth.types";

const addCategory = asyncHandler(async (req: IGetAuthRequest, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(404, "IGetAuthRequested user and userId not found");
  }

  const user = req.user;
  const { name } = req.body;

  if (user?.role !== UserRolesEnum.ADMIN) {
    throw new ApiError(403, "ERROR: ACCESS DENIED");
  }

  if (!name) {
    throw new ApiError(400, "Please fill required field");
  }

  const existedCategory = await Category.findOne({ name });

  if (existedCategory) {
    throw new ApiError(409, "category already exist");
  }

  const newCategory = await Category.create({ name });

  return res
    .status(201)
    .json(new ApiResponse(201, "category added", newCategory));
});

const removeCategory = asyncHandler(async (req: IGetAuthRequest, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(404, "IGetAuthRequested user and userId not found");
  }

  const user = req.user;
  const { name } = req.body;

  if (user?.role !== UserRolesEnum.ADMIN) {
    throw new ApiError(403, "ERROR: ACCESS DENIED");
  }

  if (!name) {
    throw new ApiError(400, "Please fill required field");
  }

  const category = await Category.findOne({ name });

  if (!category) {
    throw new ApiError(404, "category not found");
  }

  const deleteCategory = await Category.findByIdAndDelete(category?._id, {
    name,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "category remove successfully", deleteCategory));
});

const getAllCategory = asyncHandler(async (req: IGetAuthRequest, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(404, "IGetAuthRequested user and userId not found");
  }

  const user = req.user;

  if (user?.role !== UserRolesEnum.ADMIN) {
    throw new ApiError(403, "ERROR: ACCESS DENIED");
  }

  const category = await Category.find({});

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "fetched all category successfully", category));
});

export { addCategory, removeCategory, getAllCategory };
