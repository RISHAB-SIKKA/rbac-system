import type { Request, Response, NextFunction } from "express"; 
import jwt = require("jsonwebtoken"); 
import errors = require("../errors/errors");

const config = {
    JWT_SECRET: process.env.JWT_SECRET ?? "default-secret",
    JWT_ISSUER: process.env.JWT_ISSUER ?? "rbac-system",
    JWT_AUDIENCE: process.env.JWT_AUDIENCE ?? "rbac-system",
} as const;

if (!config.JWT_SECRET || !config.JWT_ISSUER || !config.JWT_AUDIENCE) {
    throw new errors.authError("JWT configuration is missing");
}

interface AuthRequest extends Request {
    user?: {
      userId: string;
    };
}

async function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new errors.authError("Unauthorized", 401);
        }

        const decoded = jwt.verify(token, config.JWT_SECRET, {
            issuer: config.JWT_ISSUER,
            audience: config.JWT_AUDIENCE,
        });

        if (!decoded) {
            throw new errors.authError("Unauthorized", 401);
        }

        req.user = {
            userId: decoded.sub as string,
        };

        next();
    } catch (error: unknown) {
        if (error instanceof errors.authError) {
            res.status(401).json({ error: error.message });
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: "Invalid or expired token" });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

export = authMiddleware;

  

