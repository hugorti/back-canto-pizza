import { Request, Response } from "express";
import { ListByRoleService } from "../../services/role/ListByRoleService";

class ListByRoleController{
    async handle(req: Request, res: Response){
        const listByRoleService = new ListByRoleService()

        try {
            const roles = await listByRoleService.execute();
            return res.json(roles);

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export {ListByRoleController}