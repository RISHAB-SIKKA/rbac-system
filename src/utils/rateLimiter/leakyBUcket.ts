import RateLimiterStrategy = require("./rateLimiterStrategy");
import type { Request } from "express";

interface LeakyBucketOptions {
    capacity: number;
    leakRate: number;
}

interface BucketState {
    queue: number;
    lastLeakTime: number;
}

class LeakyBucket implements RateLimiterStrategy {
    private static instance: Map<string, LeakyBucket> = new Map();
    private store: Map<string, BucketState> = new Map();

    private constructor(private options: LeakyBucketOptions) {}

    public static getInstance(name: string, options: LeakyBucketOptions): LeakyBucket {
        if (!this.instance.has(name)) {
            if (!options.capacity || options.capacity <= 0) {
                throw new Error("Capacity must be greater than 0");
            }
            if (!options.leakRate || options.leakRate <= 0) {
                throw new Error("Leak rate must be greater than 0");
            }
            this.instance.set(name, new LeakyBucket(options));
        }
        return this.instance.get(name) as LeakyBucket;
    }

    private getKey(req: Request): string {
        const ip = req.ip;
        const userId = (req as any).user?.id;
        return `${ip}-${userId}`;
    }

    public check(req: Request): boolean {
        const key = this.getKey(req);
        const now = Date.now();

        if (!this.store.has(key)) {
            this.store.set(key, {
                queue: 0,
                lastLeakTime: now,
            });
        }

        const bucket = this.store.get(key)!;

        const timeSinceLastLeak = (now - bucket.lastLeakTime) / 1000;
        const leaked = timeSinceLastLeak * this.options.leakRate;
        bucket.queue = Math.max(0, bucket.queue - leaked);
        bucket.lastLeakTime = now;

        if (bucket.queue < this.options.capacity) {
            bucket.queue += 1;
            return true;
        }
        return false;
    }

    public getRetryAfterMs(req: Request): number {
        const key = this.getKey(req);
        const bucket = this.store.get(key);

        if (!bucket) return 0;

        const now = Date.now();
        const timeSinceLastLeak = (now - bucket.lastLeakTime) / 1000;
        const leaked = timeSinceLastLeak * this.options.leakRate;
        const queueAfterLeak = Math.max(0, bucket.queue - leaked);

        if (queueAfterLeak < this.options.capacity) {
            return 0;
        }

        const excess = queueAfterLeak - (this.options.capacity - 1);
        const seconds = excess / this.options.leakRate;
        return Math.ceil(seconds * 1000);
    }
}

export = LeakyBucket;
