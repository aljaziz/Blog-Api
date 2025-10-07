import { Router } from "express";
import authenticate from "@/middlwares/authenticate";
import authorize from "@/middlwares/authorize";
import likeBlog from "@/controllers/v1/like/likeBlog";
import { body, param } from "express-validator";
import validationError from "@/middlwares/validationError";
import unlikeBlog from "@/controllers/v1/like/unlikeBlog";

const router = Router();

router.post(
    "/blog/:blogId",
    authenticate,
    authorize(["admin", "user"]),
    param("blogId").isMongoId().withMessage("Invalid blog ID"),
    body("userId")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID"),
    validationError,
    likeBlog
);

router.delete(
    "/blog/:blogId",
    authenticate,
    authorize(["admin", "user"]),
    param("blogId").isMongoId().withMessage("Invalid blog ID"),
    body("userId")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID"),
    validationError,
    unlikeBlog
);

export default router;
