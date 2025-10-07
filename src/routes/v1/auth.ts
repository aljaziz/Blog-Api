import { Router } from "express";
import register from "@/controllers/v1/auth/register";
import { body } from "express-validator";
import validationError from "@/middlwares/validationError";
import User from "@/models/user";
import login from "@/controllers/v1/auth/login";
import bcrypt from "bcrypt";
import {
    validateLogin,
    validateRegistration,
} from "@/middlwares/authValidation";
import refreshToken from "@/controllers/v1/auth/refreshToken";
import logout from "@/controllers/v1/auth/logout";
import authenticate from "@/middlwares/authenticate";

const router = Router();

router.post(
    "/register",
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
                throw new Error("User already exists");
            }
        }),
    body("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    body("role")
        .optional()
        .isString()
        .withMessage("Role must be a string")
        .isIn(["admin", "user"])
        .withMessage("Role must be either admin or user"),
    validationError,
    register
);

router.post(
    "/login",
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
            if (!userExists) {
                throw new Error("User email or password is invalid");
            }
        }),
    body("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .custom(async (value, { req }) => {
            const { email } = req.body as { email: string };
            const user = await User.findOne({ email })
                .select("password")
                .lean()
                .exec();
            if (!user) {
                throw new Error("User email or password is invalid");
            }
            const passwordMatch = await bcrypt.compare(value, user.password);

            if (!passwordMatch) {
                throw new Error("User email or password is invalid");
            }
        }),
    validationError,
    login
);

// router.post("/register", validateRegistration, register);

// router.post("/login", validateLogin, login);

router.post("/refresh-token", refreshToken);

router.post("/logout", authenticate, logout);

export default router;
