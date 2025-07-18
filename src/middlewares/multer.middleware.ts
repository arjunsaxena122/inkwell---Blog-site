import multer from "multer";
import path from "path";
import { ApiError } from "../utils/api-error";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now());
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    // 1024 -> 1KB , 1kB * 1024 -> 1MB
    fieldNameSize: 1024 * 1024 * 1,
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname);

    if (!["jpeg", "png", "jpg"].includes(ext)) {
      cb(null, false);
      throw new ApiError(404, "Image should be jpeg, png, and jpg");
    }
    cb(null, true);
  },
});
