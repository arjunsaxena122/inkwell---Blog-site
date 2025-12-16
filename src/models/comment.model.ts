import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/auth.types";
import { IPost } from "./post.model";

export type IComment = {
  content: string;
  likes: IUser;
  dislikes: IUser;
  post: IPost;
  user: IUser
};

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }

  },
  {
    timestamps: true,
  },
);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
