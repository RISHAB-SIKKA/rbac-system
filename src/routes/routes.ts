import authRoutes = require("./auth.routes");
import userRoutes = require("./user.routes");
import express = require("express");

const router = express.Router();

router.use("/auth", authRoutes.authRouter);
router.use("/users", userRoutes.userRouter);

export = { allRoutes: router };