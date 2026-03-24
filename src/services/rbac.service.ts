import rbacRepoModule = require("../repositories/rbac.repo");
import errors = require("../errors/errors");

class rbacService {
    constructor(private readonly rbacRepo = new rbacRepoModule()) {}

    async hasPermission(userId: string, permission: string): Promise<boolean> {
        try{
            const permissions = await this.rbacRepo.getPermissionsByUserId(userId);
            return permissions.includes(permission);
        } catch (error: unknown) {
            throw error;
        }
    }
}

export = rbacService;