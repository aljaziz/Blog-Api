import { Request, Response, NextFunction } from "express";
import { registrationSchema, loginSchema } from "@/validators/auth";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import User from "@/models/user";

export const validateRegistration = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const parsed = registrationSchema.parse(req.body);
        const userExists = await User.exists({ email: parsed.email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        req.body = parsed;
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                code: "validationError",
                errors: error.issues.map((issue) => ({
                    message: issue.message,
                })),
            });
        }
        next(error);
    }
};

export const validateLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const parsed = loginSchema.parse(req.body);
        const user = await User.findOne({ email: parsed.email })
            .select("username email password role")
            .lean()
            .exec();

        if (!user) {
            return res.status(401).json({
                message: "User email or password is invalid",
            });
        }

        const isMatch = await bcrypt.compare(parsed.password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "User email or password is invalid",
            });
        }
        req.body = parsed;
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                errors: error.issues.map((issue) => ({
                    message: issue.message,
                })),
            });
        }
        next(error);
    }
};
