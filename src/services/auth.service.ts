import userRepo = require("../repositories/user.repo");
import bcrypt = require("bcrypt");
import jwt = require("jsonwebtoken");
import errors = require("../errors/errors");
import type { JwtPayload } from "../types/auth.types";

const config = {
    bcryptSaltRounds: Number.parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10),
    jwt: {
        jwtSecret: process.env.JWT_SECRET ?? "default-secret",
        jwtExpiration: process.env.JWT_EXPIRATION ?? "1h",
        issuer: process.env.JWT_ISSUER ?? "rbac-system",
        audience: process.env.JWT_AUDIENCE ?? "rbac-system",
    } as const,
} as const;

if (!config.jwt.jwtSecret || !config.jwt.issuer || !config.jwt.audience) {
    throw new Error("JWT configuration is missing");
}

class authService {
    constructor(
        private readonly saltRounds: number = config.bcryptSaltRounds,
    ) {}
    
    async hashPassword(password: string): Promise<string> {
        try{
            if (!password || password.length < 8) {
                throw new errors.authError("Password must be at least 8 characters long");
            }
            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
            return hashedPassword;
        } catch (error: unknown) {
            throw new errors.authError("Failed to hash password", error);
        }
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        try{
            return await bcrypt.compare(password, hashedPassword);
        } catch (error: unknown) {
            throw new errors.authError("Failed to compare password", error);
        }
    }

    generateAccessToken(userId: string): string {
        try{
            const payload: JwtPayload = {
                sub: userId,
            };
            const options = {
                expiresIn: parseInt(config.jwt.jwtExpiration, 10),
                issuer: config.jwt.issuer,
                audience: config.jwt.audience,
            } as jwt.SignOptions; 

            return jwt.sign(payload, config.jwt.jwtSecret, options);
        } catch (error: unknown) {
            throw new errors.authError("Failed to generate access token", error);
        }
    }

    verifyAccessToken(token: string): JwtPayload {
        try{
            return jwt.verify(token, config.jwt.jwtSecret, {
                issuer: config.jwt.issuer,
                audience: config.jwt.audience,
            }) as JwtPayload;
        } catch (error: unknown) {
            throw new errors.authError("Failed to verify access token", error);
        }
    }   
}

export = { authService };