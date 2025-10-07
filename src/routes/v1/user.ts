import { Router } from "express";
import authenticate from "@/middlwares/authenticate";
import User from "@/models/user";
import authorize from "@/middlwares/authorize";
import getCurrentUser from "@/controllers/v1/user/getCurrentUser";
import updateCurrentUser from "@/controllers/v1/user/updateCurrentUser";
import { body, param, query } from "express-validator";
import validationError from "@/middlwares/validationError";
import deleteCurrentUser from "@/controllers/v1/user/deleteCurrentUser";
import getAllUser from "@/controllers/v1/user/getAllUser";
import getUser from "@/controllers/v1/user/getUser";
import deleteUser from "@/controllers/v1/user/deleteUser";

const router = Router();

router.get(
    "/current",
    authenticate,
    authorize(["admin", "user"]),
    getCurrentUser
);

router.put(
    "/current",
    authenticate,
    authorize(["admin", "user"]),
    body("username")
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage("username must be less than 20 characters")
        .custom(async (value) => {
            const userExists = await User.exists({ username: value });
            if (userExists) {
                throw new Error("This username is already in use");
            }
        }),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isLength({ max: 250 })
        .withMessage("Email must be less than 250 characters")
        .isEmail()
        .withMessage("Invalid email address")
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });
            if (userExists) {
                throw new Error("This email is already in use");
            }
        }),
    body("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    body("first_name")
        .optional()
        .isLength({ max: 20 })
        .withMessage("First name must be less than 20 characters"),
    body("last_name")
        .optional()
        .isLength({ max: 20 })
        .withMessage("Last name must be less than 20 characters"),
    body(["website", "facebook", "instagram", "linkedin", "x", "youtube"])
        .optional()
        .isURL()
        .withMessage("Invalid URL"),
    validationError,
    updateCurrentUser
);

router.delete(
    "/current",
    authenticate,
    authorize(["admin", "user"]),
    deleteCurrentUser
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
    getAllUser
);

router.get(
    "/:userId",
    authenticate,
    authorize(["admin", "user"]),
    param("userId").notEmpty().isMongoId().withMessage("Invalid User ID"),
    validationError,
    getUser
);

router.delete(
    "/:userId",
    authenticate,
    authorize(["admin", "user"]),
    param("userId").notEmpty().isMongoId().withMessage("Invalid User ID"),
    validationError,
    deleteUser
);

export default router;
