import type { Request, Response } from "express";
import { logger } from "@/lib/winston";
import Blog from "@/models/blog";
import User from "@/models/user";

import { v2 as cloudniary } from "cloudinary";

const deleteBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const blogId = req.params.blogId;

        const user = await User.findById(userId).select("role").lean().exec();
        const blog = await Blog.findById(blogId)
            .select("aturho banner.publicId")
            .lean()
            .exec();

        if (!blog) {
            res.status(404).json({
                code: "NotFound",
                message: "Blog not found",
            });
            return;
        }

        if (blog.author !== userId && user?.role !== "admin") {
            res.status(403).json({
                code: "AuthorizationError",
                message: "Access denied",
            });
            logger.warn("A user tried to delete a blog without permission", {
                userId,
            });
            return;
        }

        await cloudniary.uploader.destroy(blog.banner.publicId);
        logger.info("BLog banner deleted from cloudinary", {
            publicId: blog.banner.publicId,
        });

        await Blog.deleteOne({ _id: blogId });
        logger.info("Blog deleted successfully", { blogId });
        res.status(204);
    } catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal server error",
            error,
        });
        logger.error("Error while deleting blog", error);
    }
};

export default deleteBlog;
