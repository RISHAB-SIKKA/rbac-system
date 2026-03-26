import FixedWindowStrategy = require("../utils/rateLimiter/fixedWindow");
import rateLimiterStrategy = require("../utils/rateLimiter/rateLimiterStrategy");
import tokenBucket  = require("../utils/rateLimiter/tokenbucket")

class rateLimiterFactory {
    public static createLimiter(
        type: "FIXED_WINDOW" | "SLIDING_WINDOW" | "TOKEN_BUCKET",
        name: string,
        options?: any
    ): rateLimiterStrategy {
        switch(type){
            case "FIXED_WINDOW":
                return FixedWindowStrategy.getInstance(name, options);
            // case "SLIDING_WINDOW":
            //     return SlidingWindowStrategy.getInstance(name, options);
            case "TOKEN_BUCKET":
                return tokenBucket.getInstance(name, options);
            default:
                throw new Error(`Unsupported rate limiter type: ${type}`);
        }
    }
}

export = rateLimiterFactory;