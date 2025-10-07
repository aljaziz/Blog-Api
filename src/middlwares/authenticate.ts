import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { verifyAccessToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import { Request, Response, NextFunction } from "express";
import type { Types } from "mongoose";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const autheHeader = req.headers.authorization;
    if (!autheHeader?.startsWith("Bearer")) {
        res.status(401).json({
            code: "AuthenticationError",
            message: "Access denaied no token provided",
        });
        return;
    }
    const [_, token] = autheHeader.split(" ");
    try {
        const jwtPayload = verifyAccessToken(token) as {
            userId: Types.ObjectId;
        };
        req.userId = jwtPayload.userId;
        return next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            res.status(401).json({
                code: "AuthenticationError",
                message:
                    "Access token expired, request a new one with refresh token",
            });
            return;
        }

        if (error instanceof JsonWebTokenError) {
            res.status(401).json({
                code: "AuthenticationError",
                message: "Access token invalid",
            });
            return;
        }
        res.status(500).json({
            code: "ServerError",
            message: "Internal server error",
            error: error,
        });
        logger.error("Error during authentication", error);
    }
};

export default authenticate;
