import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/config";
import { ApiError } from "./api-error";
import fs from "fs";

cloudinary.config({
  cloudinary_url: env.CLOUDINARY_API_KEY,
});

export const imageUploader = async (
  localFilePath: string,
  folderName: string,
) => {
  try {
    if (!localFilePath) return;

    const imageUploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: folderName,
      resource_type: "auto",
      chunk_size: 1000 * 1000 * 1,
    });

    fs.unlinkSync(localFilePath);
    return imageUploadResult;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw new ApiError(400, "ERROR: Uploading image in cloudinary", [error]);
  }
};
