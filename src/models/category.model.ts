import { model, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: [String],
      trime: true,
      lowercase: true,
      unique: true,
      required: true,
      default: [],
    },
  },
  { timestamps: true },
);

export const Category = model("Category", categorySchema);
