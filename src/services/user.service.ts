import type { SafeUser, User, UserDTO } from "../types/user.types";
import userRepoModule = require("../repositories/user.repo");
import authServiceModule = require("./auth.service");
import errors = require("../errors/errors");


class userService {
    constructor(
        private readonly userRepo: InstanceType<typeof userRepoModule.userRepo> = new userRepoModule.userRepo(),
        private readonly authService: InstanceType<typeof authServiceModule.authService> = new authServiceModule.authService(),
    ) {}

    async register(user: UserDTO): Promise<SafeUser> {
        try {
            if (!user.email || !user.password) {
                throw new errors.ValidationError("Email and password are required");
            }

            const existingUser = await this.userRepo.findByEmail(user.email);
            if (existingUser) {
                throw new errors.ValidationError("User with this email already exists");
            }

            const hashedPassword = await this.authService.hashPassword(user.password);
            const createdUser = await this.userRepo.createUser({
                email: user.email,
                password: hashedPassword,
            });

            return {
                id: createdUser.id,
                email: createdUser.email,
            };
        } catch (error: unknown) {
            throw error;
        }
    }

    // async login(email: string, password: string): Promise<LoginResponse> {
    //     try {
    //         if (!email || !password) {
    //             throw new errors.ValidationError("Email and password are required");
    //         }

    //         const user = await this.userRepo.findByEmail(email);
    //         if (!user) {
    //             throw new errors.ValidationError("Invalid email or password");
    //         }

    //         const isPasswordValid = await this.authService.comparePassword(password, user.password);
    //         if (!isPasswordValid) {
    //             throw new errors.ValidationError("Invalid email or password");
    //         }

    //         const accessToken = this.authService.generateAccessToken(user.id);

    //         return {
    //             user: {
    //                 id: user.id,
    //                 email: user.email,
    //             },
    //             accessToken,
    //         };
    //     } catch (error: unknown) {
    //         throw error;
    //     }
    // }
}

export = { userService };