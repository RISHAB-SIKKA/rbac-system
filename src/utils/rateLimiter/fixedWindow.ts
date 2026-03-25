import RateLimiterStrategy = require("./rateLimiterStrategy");
import type { Request } from "express";

interface FixedWindowOptions {
    WindowMs: number;
    MaxRequests: number;
}

class FixedWindowStrategy implements RateLimiterStrategy {
    private static instance: Map<string, FixedWindowStrategy> = new Map();
    private store: Record<string, { count: number; windowStart: number }> = {};

    private constructor(private readonly options: FixedWindowOptions) {}

    public static getInstance(name: string, options?: FixedWindowOptions): FixedWindowStrategy {
        if (!FixedWindowStrategy.instance.has(name)) {
            FixedWindowStrategy.instance.set(
                name,
                new FixedWindowStrategy(options ?? { WindowMs: 1000, MaxRequests: 10 }),
            );
        }
        return FixedWindowStrategy.instance.get(name)!;
    }

    public check(req: Request): boolean {
        const ip = req.ip || "unknown-ip";
        const userId = (req as any).user?.id || "guest";
        const key = `${ip}-${userId}`;
        const now = Date.now();

        const entry = this.store[key];

        if (!entry) {
            this.store[key] = { count: 1, windowStart: now };
            return true;
        }

        if (now - entry.windowStart < this.options.WindowMs) {
            if (entry.count >= this.options.MaxRequests) {
                return false;
            }
            entry.count++;
            return true;
        }

        this.store[key] = { count: 1, windowStart: now };
        return true;
    }

    public getRetryAfterMs(req: Request): number {
        const ip = req.ip || "unknown-ip";
        const userId = (req as any).user?.id || "guest";
        const key = `${ip}-${userId}`;
        const entry = this.store[key];

        if (!entry) {
            return 0;
        }

        const elapsed = Date.now() - entry.windowStart;
        return Math.max(0, this.options.WindowMs - elapsed);
    }
}

export = FixedWindowStrategy;
