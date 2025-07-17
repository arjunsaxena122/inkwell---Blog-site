import mongoose, { Schema } from "mongoose";
import { AvailablePostStatusEnum, PostStatusEnum } from "../utils/constants";
import { IUser } from "./auth.model";
import { IComment } from "./comment.model";

export type IPost = {
  title: string;
  content: string;
  category: string[];
  status: string;
  likes: IUser;
  comments: IComment;
  subscribe: IUser;
  viewsCount: number;
  author: IUser;
};

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
      unique: true,
    },

    content: {
      type: String,
      trim: true,
      required: [true, "Write a blog is required"],
      unique: true,
    },

    category: {
      type: [String],
      trim: true,
      lowercase: true,
      required: [true, "category is required"],
      default: [],
    },

    status: {
      type: String,
      enum: AvailablePostStatusEnum,
      default: PostStatusEnum?.PENDING,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    subscribe: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    viewsCount: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Post = mongoose.model<IPost>("Post", postSchema);
