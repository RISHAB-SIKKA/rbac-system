import RateLimiterStrategy = require("./rateLimiterStrategy");
import type { Request } from "express";

interface TokenBucketOptions{
    capacity: number;
    refillRate: number;
}

interface bucket{
    tokens: number;
    lastRefill: number;
}

class TokenBucket implements RateLimiterStrategy {
    public static instance: Map<string, TokenBucket> = new Map();
    private store: Map<string, bucket> = new Map();

    private constructor(private options: TokenBucketOptions){}

    public static getInstance(key: string, options: TokenBucketOptions): TokenBucket{
        if(!this.instance.has(key)){
            if(!options.capacity || options.capacity <= 0){
                throw new Error("Capacity must be greater than 0");
            }
            if(!options.refillRate || options.refillRate <= 0){
                throw new Error("Refill rate must be greater than 0");
            }
            this.instance.set(key, new TokenBucket(options));
        }
        return this.instance.get(key) as TokenBucket;
    }

    private getKey(req: Request): string{
        const ip = req.ip;
        const userId = (req as any).user?.id;
        return `${ip}-${userId}`;
    }

    public check(req: Request): boolean {
        const key = this.getKey(req);
        const now = Date.now();

        const bucket = this.store.get(key);

        // If the bucket doesn't exist, create it and initialize the bucket with the tokens capacity 
        // initial tokens are equal to the capacity
        if(!bucket){
            this.store.set(key, {
                tokens: this.options.capacity,
                lastRefill: now,
            })
            return true;
        }

        // Calculate the time since the last refill
        const timeSinceLastRefill = (now - bucket.lastRefill) / 1000;
        const tokesToAdd = Math.floor(timeSinceLastRefill * this.options.refillRate);

        // Caping the tokens
        // so that if to much time lapses, the user won't get the abundace of tokens
        // This is a protection against abuse and burstable requests

        bucket.tokens = Math.min(bucket.tokens+tokesToAdd, this.options.capacity);

        bucket.lastRefill = now;

        if(bucket.tokens >= 1){
            bucket.tokens -= 1;
            return true;
        }
        return false;
    }


    public getRetryAfterMs(req: Request): number {
        const key = this.getKey(req);
        const bucket = this.store.get(key);

        if(!bucket) return 0;

        if(bucket.tokens >= 1){
            return 0;
        }

        // time to next token
        const tokensNeeded = 1 - bucket.tokens;
        const seconds = tokensNeeded / this.options.refillRate;

        return seconds*1000;
    }
};

export = TokenBucket;

