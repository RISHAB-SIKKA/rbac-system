import type { Request, Response, NextFunction } from "express";
import rbacServiceModule = require("../services/rbac.service");
import errors = require("../errors/errors");

interface PermissionRequest extends Request {
    user?: {
        userId: string;
    };
}

const rbacService = new rbacServiceModule();

function permissionMiddleware(permission: string) {
    return async function permissionCheck(
        req: PermissionRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new errors.authError("User ID is required");
            }

            const hasAccess = await rbacService.hasPermission(userId, permission);
            if (!hasAccess) {
                throw new errors.AppError("User does not have access to this resource", 403);
            }

            next();
        } catch (error: unknown) {
            if (error instanceof errors.AppError) {
                res.status(error.statusCode).json({ error: error.message });
                return;
            }
            if (error instanceof errors.authError) {
                res.status(401).json({ error: error.message });
                return;
            }
            if (error instanceof errors.DatabaseError) {
                res.status(500).json({
                    error: "Failed to verify permissions",
                    details: error.message,
                });
                return;
            }
            res.status(500).json({ error: "Internal server error" });
        }
    };
}

export = permissionMiddleware;
