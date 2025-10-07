import { genSlug } from "@/utils";
import mongoose, { Schema, Types } from "mongoose";

export interface BlogType {
    title: string;
    slug: string;
    content: string;
    banner: {
        publicId: string;
        url: string;
        width: number;
        height: number;
    };
    author: Types.ObjectId;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    status: "draft" | "published";
}

const blogSchema = new Schema<BlogType>(
    {
        title: {
            type: String,
            required: true,
            maxLength: 180,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            required: true,
        },
        banner: {
            type: new Schema(
                {
                    publicId: {
                        type: String,
                        required: true,
                    },
                    url: {
                        type: String,
                        required: true,
                    },
                    width: {
                        type: Number,
                        required: true,
                    },
                    height: {
                        type: Number,
                        required: true,
                    },
                },
                { _id: false }
            ),
            default: {},
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        likesCount: {
            type: Number,
            default: 0,
        },
        commentsCount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: {
                values: ["draft", "published"],
            },
            default: "draft",
        },
    },
    { timestamps: true }
);

blogSchema.pre("validate", function (next) {
    if (this.title && !this.slug) {
        this.slug = genSlug(this.title);
    }
    next();
});

export default mongoose.model<BlogType>("BLog", blogSchema);
