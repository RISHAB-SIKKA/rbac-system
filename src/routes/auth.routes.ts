import express = require("express");
import userControllerModule = require("../controllers/user.controller");

const authRouter = express.Router();

authRouter.post("/register", userControllerModule.register)

export = { authRouter };
