import { logger } from "@/lib/winston";
import Blog from "@/models/blog";
import type { Request, Response } from "express";
import Comment from "@/models/comment";
import User from "@/models/user";

const deleteComment = async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;
    const currentUserId = req.userId;
    try {
        const comment = await Comment.findById(commentId)
            .select("userId blogId")
            .lean()
            .exec();
        const user = await User.findById(currentUserId)
            .select("role")
            .lean()
            .exec();
        if (!comment) {
            res.status(404).json({
                code: "NotFound",
                message: "Comment not found",
            });
            return;
        }

        if (comment?.userId !== currentUserId && user?.role !== "admin") {
            res.status(403).json({
                code: "AuthorizationError",
                message: "Access denied",
            });
            return;
        }

        await Comment.deleteOne({ _id: commentId });
        logger.info("Comment deleted successfully", { commentId });

        const blog = await Blog.findById(comment.blogId)
            .select("commentsCount")
            .exec();
        if (!blog) {
            res.status(404).json({
                code: "NotFound",
                message: "Blog not found",
            });
            return;
        }
        blog.commentsCount--;
        await blog.save();

        logger.info("BLog comments info updated", {
            blogId: blog._id,
            commentsCount: blog.commentsCount,
        });

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal server error",
            error,
        });
        logger.error("Error while deleting comment", error);
    }
};

export default deleteComment;
