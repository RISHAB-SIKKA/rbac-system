import type { Request, Response } from "express";
import userServiceModule = require("../services/user.service");
import errors = require("../errors/errors");

const userService = new userServiceModule.userService();


async function register(req: Request, res: Response) {
    try{
        const { email, password } = req.body;

        const user = await userService.register({ email, password });
        res.status(201).json(user);
    } catch (error: unknown) {
            if (error instanceof errors.ValidationError) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Internal server error" });
            }
    }
}

async function login(req: Request, res: Response) {
    try{
        const { email, password } = req.body;
        const user = await userService.login(email, password);
        res.status(200).json(user);
    } catch (error: unknown) {
        if (error instanceof errors.ValidationError) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export = { register };