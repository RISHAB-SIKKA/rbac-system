import authRoutes = require("./auth.routes");
import express = require("express");

const router = express.Router();

router.use("/auth", authRoutes.authRouter);

export = { router };