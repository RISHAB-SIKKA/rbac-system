import type { Request } from "express";

abstract class RateLimiterStrategy {
    abstract check(req: Request): boolean;
    getRetryAfterMs?(req: Request): number;
}

export = RateLimiterStrategy;