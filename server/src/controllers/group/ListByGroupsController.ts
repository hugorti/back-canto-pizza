import { Request, Response } from "express";
import { ListByGroupsService } from "../../services/group/ListByGroupsService";

class ListByGroupsController{
    async handle(req: Request, res: Response){
        const listByGroupsService = new ListByGroupsService()

        try {
            const groups = await listByGroupsService.execute();
            return res.json(groups);

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export {ListByGroupsController}