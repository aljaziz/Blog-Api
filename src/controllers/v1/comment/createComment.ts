import { logger } from "@/lib/winston";
import Blog from "@/models/blog";
import type { Request, Response } from "express";
import type { CommentType } from "@/models/comment";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import Comment from "@/models/comment";

type CommentData = Pick<CommentType, "content">;

const window = new JSDOM("").window;
const purify = DOMPurify(window);

const createComment = async (req: Request, res: Response): Promise<void> => {
    const { blogId } = req.params;
    const { content } = req.body as CommentData;
    const userId = req.userId;
    try {
        const blog = await Blog.findById(blogId)
            .select("_id commentsCount")
            .exec();

        if (!blog) {
            res.status(404).json({
                code: "NotFound",
                message: "Blog not found",
            });
            return;
        }

        const cleanContent = purify.sanitize(content);
        const newComment = await Comment.create({
            blogId,
            content: cleanContent,
            userId,
        });

        logger.info("New comment created", newComment);
        blog.commentsCount++;
        await blog.save();

        logger.info("Blog comments count update", {
            blogId: blog._id,
            commentsCount: blog.commentsCount,
        });

        res.status(201).json({
            comment: newComment,
        });
    } catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal server error",
            error,
        });
        logger.error("Error while commenting in blog", error);
    }
};

export default createComment;
