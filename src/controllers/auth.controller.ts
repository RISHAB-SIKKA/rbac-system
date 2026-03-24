import type { Request, Response } from "express";
import authServiceModule = require("../services/auth.service");
import userServiceModule = require("../services/user.service");
import errors = require("../errors/errors");


const userService = new userServiceModule.userService();
const authService = new authServiceModule.authService();

async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const result = await userService.login(email, password);

        res.status(200).json(result);
    } catch (error: unknown) {
        if (error instanceof errors.authError) {
            res.status(401).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Authentication failed. Please try again." });
        }
    }
}

export = { login };