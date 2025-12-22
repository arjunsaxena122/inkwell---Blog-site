import { model, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Category name is required"]
    },
  }
);

export const Category = model("Category", categorySchema);
