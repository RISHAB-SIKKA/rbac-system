import express = require("express");
import userControllerModule = require("../controllers/user.controller");
import authControllerModule = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/register", userControllerModule.register)
authRouter.post("/login", authControllerModule.login)

export = { authRouter };
