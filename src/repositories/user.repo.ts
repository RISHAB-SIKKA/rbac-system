import pg = require("pg");
import pool = require("../config/db");
import type { User, UserDTO } from "../types/user.types";
import errors = require("../errors/errors");

class userRepo {
    constructor(private readonly db: pg.Pool = pool) {}

    async createUser(user: UserDTO): Promise<Omit<User, "password">> {
        try{

            const query = `
        INSERT INTO users (email, password)
        VALUES ($1, $2)
        RETURNING id, email
      `;

      const result: pg.QueryResult = await this.db.query(query, [
        user.email,
        user.password,
      ]);
      return result.rows[0];
        } catch (error: unknown) {
            if (
                error &&
                typeof error === "object" &&
                "code" in error &&
                error.code === "23505"
            ) {
                throw new errors.DatabaseError("User with this email already exists", error);
              }        
            throw new errors.DatabaseError("Failed to create user", error);
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try{
            const query = `
            SELECT id, email, password, created_at
            FROM users
            WHERE email = $1
            `;

            const result: pg.QueryResult = await this.db.query(query, [email]);
            return result.rows[0] || null;
        } catch (error: unknown) {
            throw new errors.DatabaseError("Failed to find user by email", error);
        }
    }
}

export = { userRepo };