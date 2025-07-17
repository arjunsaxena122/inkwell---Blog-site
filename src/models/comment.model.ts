import mongoose, { Schema } from "mongoose";
import { IUser } from "./auth.model";

export type IComment = {
  content: string;
  likes: IUser;
  dislikes: IUser;
};

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    likes: [{
      type : Schema.Types.ObjectId,
      ref : "User",
      required : true
    }],

    dislikes: [{
      type : Schema.Types.ObjectId,
      ref : "User",
      required : true
    }],
  },
  {
    timestamps: true,
  },
);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
