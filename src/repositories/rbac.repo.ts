import pg = require("pg");
import pool = require("../config/db");
import errors = require("../errors/errors");

class rbacRepo {
    constructor(private readonly db: pg.Pool = pool) {}

    async getPermissionsByUserId(userId: string): Promise<string[]> {
        try{
            const query = `
            SELECT p.name 
            from permissions p
            join role_permissions rp on p.id = rp.permission_id
            join roles r on rp.role_id = r.id
            join user_roles ur on r.id = ur.role_id
            where ur.user_id = $1
            `;

            const result: pg.QueryResult = await this.db.query(query, [userId]);
            return result.rows.map((row: { name: string }) => row.name);
        } catch (error: unknown) {
            throw new errors.DatabaseError("Failed to get permissions by user id", error);
        }
    }
}

export = rbacRepo;