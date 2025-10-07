import { logger } from "@/lib/winston";
import type { Request, Response } from "express";
import Like from "@/models/like";
import Blog from "@/models/blog";

const unlikeBlog = async (req: Request, res: Response): Promise<void> => {
    const { blogId } = req.params;
    const { userId } = req.body;
    try {
        const blog = await Blog.findById(blogId).select("likesCount").exec();

        if (!blog) {
            res.status(404).json({
                code: "NotFound",
                message: "Blog not found",
            });
            return;
        }

        const existingLike = await Like.findOne({ blogId, userId })
            .lean()
            .exec();

        if (!existingLike) {
            res.status(404).json({
                code: "NotFound",
                message: "Like not found",
            });
            return;
        }
        await Like.deleteOne({ _id: existingLike._id });
        blog.likesCount--;
        await blog.save();

        logger.info("Blog unliked successfully", {
            userId,
            blogId: blog._id,
            likesCount: blog.likesCount,
        });

        res.status(200).json({
            likesCount: blog.likesCount,
        });
    } catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal server error",
            error,
        });
        logger.error("Error while unliking blog", error);
    }
};

export default unlikeBlog;
