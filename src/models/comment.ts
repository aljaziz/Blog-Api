import mongoose, { Schema, Types } from "mongoose";

export interface CommentType {
    blogId: Types.ObjectId;
    userId: Types.ObjectId;
    content: string;
}

const commentSchema = new Schema<CommentType>(
    {
        blogId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        content: {
            type: String,
            required: true,
            maxLength: 1000,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model<CommentType>("Comment", commentSchema);
