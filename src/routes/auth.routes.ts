import express = require("express");
import userControllerModule = require("../controllers/user.controller");
import authControllerModule = require("../controllers/auth.controller");
import rateLimiterFactory = require("../services/rateLimiter.service");
import rateLimiterMiddleware = require("../middleware/rateLimiter.middleware");

const authRouter = express.Router();

const globalRateLimiter = rateLimiterFactory.createLimiter(
    "TOKEN_BUCKET",
    "GLOBAL",
    {
        capacity: 1,
        refillRate: 0.05
    }
);

const loginRateLimiter = rateLimiterFactory.createLimiter(
    "LEAKY_BUCKET",
    "LOGIN",
    {
        capacity: 5,
        leakRate: 0.05
    }
);

// authRouter.use(rateLimiterMiddleware.rateLimiterMiddleware(globalRateLimiter)) 
authRouter.use(rateLimiterMiddleware.rateLimiterMiddleware(loginRateLimiter)) 

authRouter.post("/register", userControllerModule.register)
authRouter.post(
    "/login",
    authControllerModule.login
)

export = { authRouter };

