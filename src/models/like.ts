import mongoose, { Schema, Types } from "mongoose";

interface LikeType {
    blogId?: Types.ObjectId;
    userId: Types.ObjectId;
    commentId?: Types.ObjectId;
}

const likeSchema = new Schema<LikeType>(
    {
        blogId: {
            type: Schema.Types.ObjectId,
        },
        commentId: {
            type: Schema.Types.ObjectId,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model<LikeType>("Like", likeSchema);
