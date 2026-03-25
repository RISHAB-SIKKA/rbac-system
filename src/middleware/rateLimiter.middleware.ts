import rateLimiterFactory = require("../services/rateLimiter.service");
import type rateLimiterStrategy = require("../utils/rateLimiter/rateLimiterStrategy");
import type { Request, Response, NextFunction } from "express";

const rateLimiterMiddleware = (limiter: rateLimiterStrategy) => {
    return (req: Request, res: Response, next: NextFunction) => { 

        const allowed = limiter.check(req);
        if(!allowed){
            const retryAfter = limiter.getRetryAfterMs?.(req); 
            if(retryAfter){
                res.setHeader("Retry-After", Math.ceil(retryAfter / 1000).toString());
            }
            return res.status(429).json({ error: "Too many requests", retryAfter });
        }
        
        next();
    }
}

export = { rateLimiterMiddleware };