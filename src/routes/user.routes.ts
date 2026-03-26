import authMiddleware = require("../middleware/auth.middleware");
import permissionMiddleware = require("../middleware/permission.middleware");
import express = require("express");
import userControllerModule = require("../controllers/user.controller");
import rateLimiterFactory = require("../services/rateLimiter.service");
import rateLimiterMiddleware = require("../middleware/rateLimiter.middleware");

const userRouter = express.Router();


const limiter = rateLimiterFactory.createLimiter(
    "FIXED_WINDOW", 
    "user_post_deletion", 
    { 
        WindowMs: 60000, 
        MaxRequests: 10 
    }
);

userRouter.delete(
  "/post",
  authMiddleware,
  permissionMiddleware("DELETE_POST"),
  rateLimiterMiddleware.rateLimiterMiddleware(limiter),
  (req, res) => {
    res.json({ message: "Post deleted successfully" });
  }
);

export = { userRouter };