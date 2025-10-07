import type { Request, Response } from "express";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { logger } from "@/lib/winston";
import Blog from "@/models/blog";
import type { BlogType } from "@/models/blog";

type BlogData = Pick<BlogType, "title" | "content" | "banner" | "status">;

const window = new JSDOM("").window;
const purify = DOMPurify(window);

const createBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, banner, status } = req.body as BlogData;
        const userId = req.userId;

        const cleanContent = purify.sanitize(content);

        const newBlog = await Blog.create({
            title,
            content: cleanContent,
            banner,
            status,
            author: userId,
        });

        logger.info("New blog created", newBlog);

        res.status(201).json({ blog: newBlog });
    } catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal server error",
            error,
        });
        logger.error("Error during blog creation", error);
    }
};

export default createBlog;
