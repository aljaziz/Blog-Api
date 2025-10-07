import { Router } from "express";
import createComment from "@/controllers/v1/comment/createComment";
import authenticate from "@/middlwares/authenticate";
import authorize from "@/middlwares/authorize";
import { body, param } from "express-validator";
import validationError from "@/middlwares/validationError";
import getCommentsByBlog from "@/controllers/v1/comment/getCommentsByBlog";
import deleteComment from "@/controllers/v1/comment/deleteComment";

const router = Router();

router.post(
    "/blog/:blogId",
    authenticate,
    authorize(["admin", "user"]),
    param("blogId").isMongoId().withMessage("Invalid blog ID"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    validationError,
    createComment
);

router.get(
    "/blog/:blogId",
    authenticate,
    authorize(["admin", "user"]),
    param("blogId").isMongoId().withMessage("Invalid blog ID"),
    validationError,
    getCommentsByBlog
);

router.delete(
    "/:commentId",
    authenticate,
    authorize(["admin", "user"]),
    param("commentId").isMongoId().withMessage("Invalid comment ID"),
    validationError,
    deleteComment
);

export default router;
