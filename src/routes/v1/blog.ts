import { Router } from "express";
import authenticate from "@/middlwares/authenticate";
import authorize from "@/middlwares/authorize";
import validationError from "@/middlwares/validationError";
import createBlog from "@/controllers/v1/blog/createBlog";
import multer from "multer";
import uploadBlogBanner from "@/middlwares/uploadBlogBanner";
import { body, param, query } from "express-validator";
import getAllBlogs from "@/controllers/v1/blog/getAllBlogs";
import getBlogsByUser from "@/controllers/v1/blog/getBlogsByUser";
import getBlogsBySlug from "@/controllers/v1/blog/getBlogsBySlugs";
import updateBlog from "@/controllers/v1/blog/updateBlog";
import deleteBlog from "@/controllers/v1/blog/deleteBlog";

const upload = multer();
const router = Router();

router.post(
    "/",
    authenticate,
    authorize(["admin"]),
    upload.single("banner_image"),
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 180 })
        .withMessage("Title must be less than 180 characters"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("status")
        .optional()
        .isIn(["draft", "published"])
        .withMessage("Status must be one of the value, draft or published"),
    validationError,
    uploadBlogBanner("post"),
    createBlog
);

router.get(
    "/",
    authenticate,
    authorize(["admin", "user"]),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage("Limit must be between 1 to 50"),
    query("offset")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Page must be a positive integer"),
    validationError,
    getAllBlogs
);
router.get(
    "/users/:userId",
    authenticate,
    authorize(["admin", "user"]),
    param("userId").isMongoId().withMessage("Invalid user ID"),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage("Limit must be between 1 to 50"),
    query("offset")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Page must be a positive integer"),
    validationError,
    getBlogsByUser
);

router.get(
    "/:slug",
    authenticate,
    authorize(["admin", "user"]),
    param("slug").notEmpty().withMessage("Slug is required"),
    validationError,
    getBlogsBySlug
);

router.put(
    "/:blogId",
    authenticate,
    authorize(["admin"]),
    param("blogId").isMongoId().withMessage("Invalid blog ID"),
    upload.single("banner_image"),
    body("title")
        .optional()
        .trim()
        .isLength({ max: 180 })
        .withMessage("Title must be less than 180 characters"),
    body("content").optional().trim(),
    body("status")
        .optional()
        .isIn(["draft", "published"])
        .withMessage("Status must be one of the value, draft or published"),
    validationError,
    uploadBlogBanner("put"),
    updateBlog
);

router.delete(
    "/:blogId",
    authenticate,
    authorize(["admin"]),
    param("blogId").isMongoId().withMessage("Invalid blog ID"),
    deleteBlog
);

export default router;
