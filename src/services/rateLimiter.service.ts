import FixedWindowStrategy = require("../utils/rateLimiter/fixedWindow");
import LeakyBucket = require("../utils/rateLimiter/leakyBUcket");
import rateLimiterStrategy = require("../utils/rateLimiter/rateLimiterStrategy");
import tokenBucket  = require("../utils/rateLimiter/tokenbucket")

class rateLimiterFactory {
    public static createLimiter(
        type: "FIXED_WINDOW" | "LEAKY_BUCKET" | "TOKEN_BUCKET",
        name: string,
        options?: any
    ): rateLimiterStrategy {
        switch(type){
            case "FIXED_WINDOW":
                return FixedWindowStrategy.getInstance(name, options);
            case "LEAKY_BUCKET":
                return LeakyBucket.getInstance(name, options);
            case "TOKEN_BUCKET":
                return tokenBucket.getInstance(name, options);
            default:
                throw new Error(`Unsupported rate limiter type: ${type}`);
        }
    }
}

export = rateLimiterFactory;